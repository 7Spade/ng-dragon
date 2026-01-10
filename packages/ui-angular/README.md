# ui-angular

> 🎨 **Angular Frontend Application** — User interface layer using facades to access backend capabilities

## Mission

Provide Angular frontend application that interacts with backend/domain through **facades only**. Never directly use SDKs or core-engine.

## Overview

`ui-angular` is the presentation layer built with Angular, using the facade pattern to encapsulate all backend interactions. The actual code lives in `/src/app` at the project root.

## Folder Structure

```
src/app/                       # Angular application (project root)
├── adapters/                  # Facades wrapping platform-adapters
│   ├── core-engine.facade.ts
│   ├── account.facade.ts
│   └── workspace.facade.ts
│
├── features/                  # Feature modules
│   ├── tasks/
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   ├── issues/
│   ├── finance/
│   └── dashboard/
│
├── core/                      # Core infrastructure
│   ├── i18n/                  # Internationalization
│   ├── startup/               # App initialization
│   ├── net/                   # HTTP interceptors
│   ├── guards/                # Route guards
│   └── state/                 # Global state management
│
├── routes/                    # Routing configuration
│   ├── app.routes.ts
│   └── route.guards.ts
│
├── shared/                    # Shared UI components
│   ├── components/
│   ├── directives/
│   ├── pipes/
│   └── ui/
│
└── layout/                    # Layout components
    ├── basic/
    ├── blank/
    └── header/
```

## Facade Pattern

Facades encapsulate all backend interactions, providing a clean API for components:

```typescript
// ✅ CORRECT - Facade in adapters/
@Injectable({ providedIn: 'root' })
export class AccountFacade {
  constructor(
    private accountService: AccountService, // From platform-adapters
    private commandBus: CommandBus // From platform-adapters
  ) {}

  createAccount(email: string): Promise<void> {
    const command = new CreateAccountCommand(email, getCurrentUserId(), new Date().toISOString());
    return this.commandBus.execute(command);
  }

  getAccount(accountId: string): Observable<AccountDTO> {
    return this.accountService.getAccount(accountId);
  }

  suspendAccount(accountId: string): Promise<void> {
    const command = new SuspendAccountCommand(accountId);
    return this.commandBus.execute(command);
  }
}
```

## Component Usage

```typescript
// ✅ CORRECT - Component using facade
@Component({
  selector: 'app-account-page',
  template: `
    <div *ngIf="account$ | async as account">
      <h1>{{ account.email }}</h1>
      <button (click)="suspend()">Suspend Account</button>
    </div>
  `
})
export class AccountPageComponent implements OnInit {
  private facade = inject(AccountFacade);
  private route = inject(ActivatedRoute);
  
  account$!: Observable<AccountDTO>;

  ngOnInit() {
    const accountId = this.route.snapshot.params['id'];
    this.account$ = this.facade.getAccount(accountId);
  }

  suspend() {
    const accountId = this.route.snapshot.params['id'];
    this.facade.suspendAccount(accountId).then(() => {
      // Navigate or show success message
    });
  }
}

// ❌ INCORRECT - Direct Firestore usage
@Component({...})
export class AccountPageComponent {
  private firestore = inject(Firestore);
  
  ngOnInit() {
    // NO! Don't use Firestore directly
    const docRef = doc(this.firestore, 'accounts', accountId);
    this.account$ = docData(docRef);
  }
}
```

## Allowed Dependencies

| Can Import | Example |
|-----------|---------|
| @angular/* | Components, services, routing |
| @angular/fire | Firestore client SDK (for auth, read operations) |
| platform-adapters facades | AccountFacade, WorkspaceFacade |
| Shared UI libraries | Angular Material, NG-ZORRO |

## Forbidden Dependencies

| Cannot Import | Why |
|--------------|-----|
| firebase-admin | Server SDK |
| @core-engine direct | Use facades instead |
| @account-domain direct | Use DTOs from facades |
| @saas-domain direct | Use facades |

## Anti-Patterns

### ❌ DO NOT

```typescript
// ❌ BAD - Direct SDK usage
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({...})
export class TasksComponent {
  private firestore = inject(Firestore);
  
  createTask(task: any) {
    // NO! Use facade
    addDoc(collection(this.firestore, 'tasks'), task);
  }
}

// ❌ BAD - Importing core-engine directly
import { CommandBus } from '@core-engine/commands/command-bus.interface';

@Component({...})
export class TasksComponent {
  constructor(private commandBus: CommandBus) {} // NO! Use facade
}

// ❌ BAD - Using domain objects in templates
import { Account } from '@account-domain/aggregates/account';

@Component({
  template: `<div>{{ account.suspend() }}</div>` // NO! Use DTOs
})
export class AccountComponent {
  account!: Account; // NO! Use AccountDTO
}
```

### ✅ DO

```typescript
// ✅ GOOD - Using facade
@Component({...})
export class TasksComponent {
  private facade = inject(TasksFacade);
  
  createTask(title: string, description: string) {
    this.facade.createTask(title, description);
  }
}

// ✅ GOOD - Using DTOs
@Component({
  template: `<div>{{ account.email }}</div>`
})
export class AccountComponent {
  account$!: Observable<AccountDTO>; // DTO from facade
  
  ngOnInit() {
    this.account$ = this.facade.getAccount(this.accountId);
  }
}

// ✅ GOOD - @angular/fire for auth (allowed)
@Component({...})
export class LoginComponent {
  private auth = inject(Auth);
  
  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }
}
```

## Route Guards

```typescript
// ✅ CORRECT - Guard using facade
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private authFacade = inject(AuthFacade);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authFacade.isAuthenticated();
  }
}
```

## Testing Guidelines

```typescript
// ✅ Component test with mocked facade
describe('TasksComponent', () => {
  let component: TasksComponent;
  let facade: jest.Mocked<TasksFacade>;

  beforeEach(() => {
    facade = {
      getTasks: jest.fn(() => of([])),
      createTask: jest.fn(() => Promise.resolve())
    } as any;

    TestBed.configureTestingModule({
      imports: [TasksComponent],
      providers: [
        { provide: TasksFacade, useValue: facade }
      ]
    });

    component = TestBed.createComponent(TasksComponent).componentInstance;
  });

  it('should load tasks on init', () => {
    component.ngOnInit();
    expect(facade.getTasks).toHaveBeenCalled();
  });
});
```

## Principles

1. **Facade-first**: UI 僅透過 adapters/facade 呼叫後端或 domain 功能
2. **SDK 最小化**: 僅允許 `@angular/fire`；其他 SDK 封裝在 `platform-adapters`
3. **DTO Only**: Components use DTOs, never domain objects
4. **No Business Logic**: Business rules stay in domain, UI only presents and collects input

## Related Documentation

- [packages/AGENTS.md](../../AGENTS.md) - Package boundaries
- [AGENTS.md](AGENTS.md) - AI generation guidelines

## License

MIT
