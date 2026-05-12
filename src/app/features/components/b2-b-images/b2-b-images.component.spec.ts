import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2BIMAGESComponent } from './b2-b-images.component';

describe('B2BIMAGESComponent', () => {
  let component: B2BIMAGESComponent;
  let fixture: ComponentFixture<B2BIMAGESComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [B2BIMAGESComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2BIMAGESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
