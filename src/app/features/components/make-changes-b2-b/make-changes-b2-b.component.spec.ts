import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeChangesB2BComponent } from './make-changes-b2-b.component';

describe('MakeChangesB2BComponent', () => {
  let component: MakeChangesB2BComponent;
  let fixture: ComponentFixture<MakeChangesB2BComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeChangesB2BComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeChangesB2BComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
