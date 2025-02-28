import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerListDetailsComponent } from './influencer-list-details.component';

describe('InfluencerListDetailsComponent', () => {
  let component: InfluencerListDetailsComponent;
  let fixture: ComponentFixture<InfluencerListDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfluencerListDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfluencerListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
