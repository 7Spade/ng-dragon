import { Injectable, inject, APP_INITIALIZER } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { Observable, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { I18NService } from '../i18n/i18n.service';
import { FirebaseAuthBridgeService } from '../auth/firebase-auth-bridge.service';
import { WorkspaceService, Workspace } from '../../workspaces/workspace.service';
import { WorkspaceContextService } from '../../workspaces/workspace-context.service';

interface UserProfile {
  name?: string;
  avatar?: string;
  email?: string;
  role?: string;
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
  private menuService = inject(MenuService);
  private settingService = inject(SettingsService);
  private aclService = inject(ACLService);
  private titleService = inject(TitleService);
  private router = inject(Router);
  private i18n = inject<I18NService>(ALAIN_I18N_TOKEN);
  private authBridge = inject(FirebaseAuthBridgeService);
  private workspaceService = inject(WorkspaceService);
  private contextService = inject(WorkspaceContextService);

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
    // 1. 載入語言資料
    const defaultLang = this.i18n.defaultLang;
    const langData = await this.i18n.loadLangData(defaultLang).toPromise();
    this.i18n.use(defaultLang, langData);

    // 2. 等待 Firebase Auth 初始化（統一從 bridge 取得，避免重複監聽）
    this.authBridge.init(); // 保證唯一註冊且可被 APP_INITIALIZER 或其它入口共用
    const user = await this.authBridge.waitForAuthState();

    // 3. 設定應用資訊
    this.settingService.setApp({
      name: 'NG-EVENTS',
      description: 'Event Management Application'
    });

    // 4. 根據登入狀態載入資料
    if (user) {
      await this.loadAuthenticatedUserData(user);
    } else {
      await this.loadAnonymousUserData();
    }

    // 5. 設定 ACL 權限
    this.aclService.setFull(true);

    // 6. 設定頁面標題
    this.titleService.default = '';
    this.titleService.suffix = 'NG-EVENTS';

    // 7. 監聽 workspace context 變化，動態刷新選單
    this.subscribeToContextChanges();
  }

  /**
   * 載入已登入用戶的資料
   */
  private async loadAuthenticatedUserData(user: User): Promise<void> {
    try {
      // 從 Firestore 載入用戶資料
      const userProfile = await this.getUserProfile(user.uid);

      // 設定用戶資訊
      this.settingService.setUser({
        name: userProfile.name || user.displayName || user.email,
        avatar: userProfile.avatar || user.photoURL || './assets/tmp/img/avatar.jpg',
        email: user.email || ''
      });

      // 載入用戶特定的選單
      const menu = await this.loadUserMenu(user.uid, userProfile.role);
      this.menuService.add(menu);
    } catch (error) {
      console.error('Failed to load user data:', error);
      // 載入預設選單作為 fallback
      this.loadDefaultMenu();
    }
  }

  /**
   * 載入未登入用戶的資料
   */
  private async loadAnonymousUserData(): Promise<void> {
    // 未登入時載入預設選單
    this.loadDefaultMenu();
  }

  /**
   * 從 Firestore 獲取用戶資料
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
   * 根據用戶角色載入選單
   */
  private async loadUserMenu(uid: string, role?: string): Promise<any[]> {
    // TODO: 根據用戶角色從 Firestore 或 Remote Config 載入選單
    // 目前使用預設選單
    return this.getDefaultMenu();
  }

  /**
   * 載入預設選單
   */
  private loadDefaultMenu(): void {
    this.menuService.add(this.getDefaultMenu());
  }

  /**
   * 獲取預設選單結構
   */
  private getDefaultMenu(): any[] {
    return [
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
    ];
  }

  /**
   * 監聽 workspace context 變化，動態刷新選單
   */
  private subscribeToContextChanges(): void {
    this.contextService.context$.subscribe(context => {
      this.refreshMenuForCurrentContext(context.organizationId, context.teamId);
    });
  }

  /**
   * 根據當前 organization/team context 刷新選單
   * @param organizationId 當前組織 ID (null 表示未選擇)
   * @param teamId 當前團隊 ID (null 表示未選擇)
   */
  async refreshMenuForCurrentContext(organizationId: string | null, teamId: string | null): Promise<void> {
    const user = this.authBridge.getCurrentUser();
    if (!user) {
      this.loadDefaultMenu();
      return;
    }

    let menu: any[] = [];

    if (organizationId && teamId) {
      // Team context: show team-specific menu
      menu = await this.getTeamMenu(organizationId, teamId, user.uid);
    } else if (organizationId) {
      // Organization context: show organization menu with teams
      menu = await this.getOrganizationMenu(organizationId, user.uid);
    } else {
      // No context: show default user menu
      menu = this.getDefaultMenu();
    }

    // Replace menu
    this.menuService.clear();
    this.menuService.add(menu);
  }

  /**
   * 獲取組織選單（包含團隊列表）
   */
  private async getOrganizationMenu(organizationId: string, userId: string): Promise<any[]> {
    // Get organization and its teams
    const workspace = await this.getWorkspaceById(organizationId);
    if (!workspace) {
      return this.getDefaultMenu();
    }

    const isOwner = workspace.ownerUserId === userId;
    const teams = workspace.teams || [];

    const menu: any[] = [
      {
        text: '主選單',
        group: true,
        children: [
          {
            text: '儀表板',
            link: '/dashboard',
            icon: { type: 'icon', value: 'appstore' }
          },
          {
            text: workspace.name,
            icon: { type: 'icon', value: 'apartment' },
            children: [
              {
                text: '組織概覽',
                link: `/organizations/${organizationId}`,
                icon: { type: 'icon', value: 'home' }
              }
            ]
          }
        ]
      }
    ];

    // Add teams section
    if (teams.length > 0) {
      const teamChildren: any[] = teams.map(team => ({
        text: team.teamName,
        link: `/organizations/${organizationId}/teams/${team.teamId}`,
        icon: { type: 'icon', value: 'team' }
      }));

      // Add create team option for owners/admins
      if (isOwner) {
        teamChildren.push({
          text: '建立團隊',
          link: `/organizations/${organizationId}/teams/create`,
          icon: { type: 'icon', value: 'plus' }
        });
      }

      menu[0].children.push({
        text: '團隊',
        icon: { type: 'icon', value: 'team' },
        children: teamChildren
      });
    } else if (isOwner) {
      // No teams but is owner - show create option
      menu[0].children.push({
        text: '建立團隊',
        link: `/organizations/${organizationId}/teams/create`,
        icon: { type: 'icon', value: 'plus' }
      });
    }

    return menu;
  }

  /**
   * 獲取團隊選單
   */
  private async getTeamMenu(organizationId: string, teamId: string, userId: string): Promise<any[]> {
    const workspace = await this.getWorkspaceById(organizationId);
    if (!workspace) {
      return this.getDefaultMenu();
    }

    const team = workspace.teams?.find(t => t.teamId === teamId);
    if (!team) {
      return this.getOrganizationMenu(organizationId, userId);
    }

    return [
      {
        text: '主選單',
        group: true,
        children: [
          {
            text: '儀表板',
            link: '/dashboard',
            icon: { type: 'icon', value: 'appstore' }
          },
          {
            text: workspace.name,
            link: `/organizations/${organizationId}`,
            icon: { type: 'icon', value: 'apartment' }
          },
          {
            text: team.teamName,
            icon: { type: 'icon', value: 'team' },
            children: [
              {
                text: '團隊概覽',
                link: `/organizations/${organizationId}/teams/${teamId}`,
                icon: { type: 'icon', value: 'home' }
              },
              {
                text: '團隊成員',
                link: `/organizations/${organizationId}/teams/${teamId}/members`,
                icon: { type: 'icon', value: 'user' }
              },
              {
                text: '團隊設定',
                link: `/organizations/${organizationId}/teams/${teamId}/settings`,
                icon: { type: 'icon', value: 'setting' }
              }
            ]
          }
        ]
      }
    ];
  }

  /**
   * Get workspace by ID
   */
  private async getWorkspaceById(id: string): Promise<Workspace | null> {
    try {
      const workspace = await this.workspaceService.getWorkspaceById(id).toPromise();
      return workspace || null;
    } catch {
      return null;
    }
  }
}

// END OF FILE
