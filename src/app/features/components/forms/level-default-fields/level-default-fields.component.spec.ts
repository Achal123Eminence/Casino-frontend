import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelDefaultFieldsComponent } from './level-default-fields.component';

describe('LevelDefaultFieldsComponent', () => {
  let component: LevelDefaultFieldsComponent;
  let fixture: ComponentFixture<LevelDefaultFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelDefaultFieldsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelDefaultFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
