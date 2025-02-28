import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerListsComponent } from './influencer-lists.component';

describe('InfluencerListsComponent', () => {
  let component: InfluencerListsComponent;
  let fixture: ComponentFixture<InfluencerListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfluencerListsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfluencerListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
