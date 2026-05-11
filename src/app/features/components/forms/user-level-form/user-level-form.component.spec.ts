import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLevelFormComponent } from './user-level-form.component';

describe('UserLevelFormComponent', () => {
  let component: UserLevelFormComponent;
  let fixture: ComponentFixture<UserLevelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLevelFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLevelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
