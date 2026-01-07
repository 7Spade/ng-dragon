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

  it('exposes owned organizations seeded for the current account', () => {
    expect(facade.ownedOrganizations().length).toBeGreaterThan(0);
  });

  it('computes permissions for selected organization', () => {
    expect(facade.canCreateTeam()).toBeTrue();
  });
});
