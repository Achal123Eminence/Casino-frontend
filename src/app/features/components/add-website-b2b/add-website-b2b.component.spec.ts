import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWebsiteB2bComponent } from './add-website-b2b.component';

describe('AddWebsiteB2bComponent', () => {
  let component: AddWebsiteB2bComponent;
  let fixture: ComponentFixture<AddWebsiteB2bComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWebsiteB2bComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWebsiteB2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
