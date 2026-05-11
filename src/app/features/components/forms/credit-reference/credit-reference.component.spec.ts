import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditReferenceComponent } from './credit-reference.component';

describe('CreditReferenceComponent', () => {
  let component: CreditReferenceComponent;
  let fixture: ComponentFixture<CreditReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditReferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
