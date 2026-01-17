import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceCommandPaletteComponent } from './workspace-command-palette.component';

describe('WorkspaceCommandPaletteComponent', () => {
  let component: WorkspaceCommandPaletteComponent;
  let fixture: ComponentFixture<WorkspaceCommandPaletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceCommandPaletteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceCommandPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
