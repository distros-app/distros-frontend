import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HideInfluencerComponent } from './hide-influencer.component';

describe('HideInfluencerComponent', () => {
  let component: HideInfluencerComponent;
  let fixture: ComponentFixture<HideInfluencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HideInfluencerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HideInfluencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
