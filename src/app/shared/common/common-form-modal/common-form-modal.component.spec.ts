import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonFormModalComponent } from './common-form-modal.component';

describe('CommonFormModalComponent', () => {
  let component: CommonFormModalComponent;
  let fixture: ComponentFixture<CommonFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
