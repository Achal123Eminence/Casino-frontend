import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandlePermissionComponent } from './handle-permission.component';

describe('HandlePermissionComponent', () => {
  let component: HandlePermissionComponent;
  let fixture: ComponentFixture<HandlePermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandlePermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandlePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
