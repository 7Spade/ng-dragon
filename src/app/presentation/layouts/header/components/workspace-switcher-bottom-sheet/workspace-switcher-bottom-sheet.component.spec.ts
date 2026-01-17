import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceSwitcherBottomSheetComponent } from './workspace-switcher-bottom-sheet.component';

describe('WorkspaceSwitcherBottomSheetComponent', () => {
  let component: WorkspaceSwitcherBottomSheetComponent;
  let fixture: ComponentFixture<WorkspaceSwitcherBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceSwitcherBottomSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceSwitcherBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
