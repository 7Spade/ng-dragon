import { Injectable, inject, APP_INITIALIZER, effect } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { Observable, from, of, firstValueFrom, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { I18NService } from '../i18n/i18n.service';
import { FirebaseAuthBridgeService } from '../auth/firebase-auth-bridge.service';
import { ContextService } from '../context/context.service';
import type { ContextType } from '@account-domain';
import { Workspace, WorkspaceService } from '../../workspaces/workspace.service';

interface UserProfile {
  name?: string;
  avatar?: string;
  email?: string;
  role?: string;
}

interface AppData {
  app: { name: string; description: string };
  user: { name: string; avatar: string; email: string };
  menus: {
    user: any[];
    organization: any[];
    team: any[];
    partner: any[];
  };
}

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
export function provideStartup() {
  return [
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: (startupService: StartupService) => () => startupService.load(),
      deps: [StartupService],
      multi: true
    }
  ];
}

@Injectable()
export class StartupService {
  private firestore = inject(Firestore);
  private http = inject(HttpClient);
  private menuService = inject(MenuService);
  private settingService = inject(SettingsService);
  private aclService = inject(ACLService);
  private titleService = inject(TitleService);
  private router = inject(Router);
  private i18n = inject<I18NService>(ALAIN_I18N_TOKEN);
  private authBridge = inject(FirebaseAuthBridgeService);
  private contextService = inject(ContextService);
  private workspaceService = inject(WorkspaceService);

  private appData: AppData | null = null;
  private projectsSub?: Subscription;

  constructor() {
    // React to context changes and reload menu
    effect(() => {
      const context = this.contextService.currentContext();
      if (this.appData) {
        this.loadMenuForContext(context.type);
      }
    });
  }

  load(): Observable<void> {
    return from(this.loadAsync()).pipe(
      catchError(error => {
        console.error('Startup service failed:', error);
        setTimeout(() => this.router.navigateByUrl(`/exception/500`));
        return of(void 0);
      })
    );
  }

  private async loadAsync(): Promise<void> {
    // 1. Load language data
    const defaultLang = this.i18n.defaultLang;
    const langData = await this.i18n.loadLangData(defaultLang).toPromise();
    this.i18n.use(defaultLang, langData);

    // 2. Load app data (menus structure)
    this.appData = await firstValueFrom(
      this.http.get<AppData>('./assets/tmp/app-data.json').pipe(
        catchError(err => {
          console.error('Failed to load app-data.json:', err);
          return of(this.getDefaultAppData());
        })
      )
    );

    // 3. Wait for Firebase Auth initialization
    this.authBridge.init();
    const user = await this.authBridge.waitForAuthState();

    // 4. Set application info
    this.settingService.setApp({
      name: this.appData.app.name,
      description: this.appData.app.description
    });

    // 5. Load data based on authentication state
    if (user) {
      await this.loadAuthenticatedUserData(user);
      this.subscribeProjectsMenu();
    } else {
      await this.loadAnonymousUserData();
    }

    // 6. Load initial menu based on current context
    const currentContext = this.contextService.currentContext();
    this.loadMenuForContext(currentContext.type);

    // 7. Set ACL permissions
    this.aclService.setFull(true);

    // 8. Set page title
    this.titleService.default = '';
    this.titleService.suffix = this.appData.app.name;
  }

  /**
   * Load menu for specific context
   */
  private loadMenuForContext(contextType: ContextType): void {
    if (!this.appData) return;

    const menu = this.appData.menus[contextType] || this.appData.menus.user;
    this.menuService.clear();
    this.menuService.add(menu);
    console.log(`Menu loaded for context: ${contextType}`, menu);
  }

  /**
   * Subscribe to the user's projects and update the menu dynamically.
   */
  private subscribeProjectsMenu(): void {
    if (this.projectsSub) {
      this.projectsSub.unsubscribe();
    }

    this.projectsSub = this.workspaceService.getUserWorkspaces('project').subscribe(projects => {
      this.updateProjectsMenu(projects);
      const context = this.contextService.currentContext();
      this.loadMenuForContext(context.type);
    });
  }

  private updateProjectsMenu(projects: Workspace[]): void {
    if (!this.appData?.menus?.user) return;

    const projectGroup = this.appData.menus.user.find(
      item => item.i18n === 'menu.projects' || item.text === '项目'
    );

    if (!projectGroup) return;

    const baseChildren =
      projectGroup.children?.filter(
        (child: any) =>
          child.i18n === 'menu.projects.create' ||
          child.i18n === 'menu.projects.my' ||
          child.link === '/projects/create' ||
          child.link === '/projects'
      ) ?? [];

    const dynamicChildren = this.buildProjectMenuItems(projects);
    projectGroup.children = [...baseChildren, ...dynamicChildren];
  }

  private buildProjectMenuItems(projects: Workspace[]): any[] {
    const items = projects.slice(0, 10).map(project => ({
      text: project.name || project.id,
      link: `/projects/${project.id}`,
      icon: 'anticon-folder-open'
    }));

    if (projects.length > 10) {
      items.push({
        text: 'More',
        children: projects.slice(10).map(project => ({
          text: project.name || project.id,
          link: `/projects/${project.id}`,
          icon: 'anticon-folder'
        }))
      });
    }

    return items;
  }

  /**
   * Load authenticated user data
   */
  private async loadAuthenticatedUserData(user: User): Promise<void> {
    try {
      // Load user profile from Firestore
      const userProfile = await this.getUserProfile(user.uid);

      // Set user info
      this.settingService.setUser({
        name: userProfile.name || user.displayName || user.email,
        avatar: userProfile.avatar || user.photoURL || './assets/tmp/img/avatar.jpg',
        email: user.email || ''
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Use default user data as fallback
      this.settingService.setUser({
        name: user.displayName || user.email || 'User',
        avatar: user.photoURL || './assets/tmp/img/avatar.jpg',
        email: user.email || ''
      });
    }
  }

  /**
   * Load anonymous user data
   */
  private async loadAnonymousUserData(): Promise<void> {
    // Load default menu for anonymous users
    if (this.appData) {
      this.menuService.add(this.appData.menus.user);
    }
  }

  /**
   * Get user profile from Firestore
   */
  private async getUserProfile(uid: string): Promise<UserProfile> {
    const docRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }

    return {};
  }

  /**
   * Get default app data structure
   */
  private getDefaultAppData(): AppData {
    return {
      app: { name: 'NG-EVENTS', description: 'Event Management Application' },
      user: { name: 'Admin', avatar: './assets/tmp/img/avatar.jpg', email: 'admin@example.com' },
      menus: {
        user: [
          {
            text: '主選單',
            group: true,
            children: [
              {
                text: '儀表板',
                link: '/dashboard',
                icon: { type: 'icon', value: 'appstore' }
              }
            ]
          }
        ],
        organization: [],
        team: [],
        partner: []
      }
    };
  }
}
