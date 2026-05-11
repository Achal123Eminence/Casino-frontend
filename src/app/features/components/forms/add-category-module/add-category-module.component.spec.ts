import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryModuleComponent } from './add-category-module.component';

describe('AddCategoryModuleComponent', () => {
  let component: AddCategoryModuleComponent;
  let fixture: ComponentFixture<AddCategoryModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCategoryModuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCategoryModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
