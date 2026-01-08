import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { OrganizationSessionFacade } from './organization-session.facade';

describe('OrganizationSessionFacade', () => {
  let facade: OrganizationSessionFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        OrganizationSessionFacade,
        ACLService,
        {
          provide: DA_SERVICE_TOKEN,
          useValue: {
            get: () => ({ uid: 'test-account' }),
            clear: jasmine.createSpy('clear'),
            login_url: '/login',
          },
        },
      ],
    });

    facade = TestBed.inject(OrganizationSessionFacade);
  });

  it('seeds owned organizations for the current account', async () => {
    await facade.whenReady();
    expect(facade.ownedOrganizations().length).toBeGreaterThan(0);
  });

  it('creates a new organization via workspace application service', async () => {
    await facade.whenReady();
    const before = facade.ownedOrganizations().length;
    await facade.createOrganization('My Org');
    expect(facade.ownedOrganizations().length).toBeGreaterThan(before);
  });

  it('computes permissions for selected organization', async () => {
    await facade.whenReady();
    const first = facade.ownedOrganizations()[0];
    await facade.selectOrganization(first.id);
    expect(facade.canCreateTeam()).toBeTrue();
  });
});
