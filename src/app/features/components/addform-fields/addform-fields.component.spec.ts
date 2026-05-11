import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddformFieldsComponent } from './addform-fields.component';

describe('AddformFieldsComponent', () => {
  let component: AddformFieldsComponent;
  let fixture: ComponentFixture<AddformFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddformFieldsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddformFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
