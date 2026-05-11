import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideFormModalComponent } from './side-form-modal.component';

describe('SideFormModalComponent', () => {
  let component: SideFormModalComponent;
  let fixture: ComponentFixture<SideFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
