import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoProviderComponent } from './casino-provider.component';

describe('CasinoProviderComponent', () => {
  let component: CasinoProviderComponent;
  let fixture: ComponentFixture<CasinoProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasinoProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasinoProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
