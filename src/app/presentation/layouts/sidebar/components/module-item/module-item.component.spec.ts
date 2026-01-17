import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleItemComponent } from './module-item.component';

describe('ModuleItemComponent', () => {
  let component: ModuleItemComponent;
  let fixture: ComponentFixture<ModuleItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
