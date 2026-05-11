import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLevelUserComponent } from './create-level-user.component';

describe('CreateLevelUserComponent', () => {
  let component: CreateLevelUserComponent;
  let fixture: ComponentFixture<CreateLevelUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLevelUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLevelUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
