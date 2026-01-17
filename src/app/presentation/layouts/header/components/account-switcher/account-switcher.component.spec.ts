import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSwitcherComponent } from './account-switcher.component';

describe('AccountSwitcherComponent', () => {
  let component: AccountSwitcherComponent;
  let fixture: ComponentFixture<AccountSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSwitcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
