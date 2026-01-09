# Organization file usage audit

Audit date: 2026-01-09. Approach: grep search for inbound imports/usages inside the monorepo.

| File | Observations | Usage status |
| --- | --- | --- |
| packages/core-engine/src/commands/create-organization.command.ts | Imported by the CreateOrganization use case and UI service. | **In use** |
| packages/core-engine/src/use-cases/create-organization.usecase.ts | Used by `CreateOrganizationService` in `packages/ui-angular/src/app/workspaces`. | **In use** |
| packages/platform-adapters/src/firebase-platform/workspace.repository.firebase.ts | Only referenced by `persistence/workspaces/firestore-workspace.repository.ts` (and README); no runtime wiring from UI or services. | **Not wired/unused** |
| packages/saas-domain/src/aggregates/workspace.aggregate.ts | Consumed only by the Firebase repository adapter above; otherwise not referenced by UI/application code. | **Not wired/unused** |
| packages/saas-domain/src/application/workspace-application-service.ts | No inbound references outside the barrel export; factory import uses a mismatched path and is itself unused. | **Unused** |
| packages/saas-domain/src/domain/workspace-factory.ts | Only used by the unused application service; no other imports found. | **Unused** |
| packages/ui-angular/src/app/features/routes.ts | Imported in `app.config.ts` to register feature routes. | **In use** |
| packages/ui-angular/src/app/layout/basic/widgets/user.component.ts | Rendered in `layout/basic/basic.component.ts` as `<header-user>`. | **In use** |
| packages/ui-angular/src/app/workspaces/create-organization-form.component.ts | Routed via `app/features/routes.ts`; depends on the creation service. | **In use** |
| packages/ui-angular/src/app/workspaces/create-organization.service.ts | Injected in the create-organization form component to call the use case. | **In use** |

_Findings are based on current repository references; status may change if new wiring is added later._
