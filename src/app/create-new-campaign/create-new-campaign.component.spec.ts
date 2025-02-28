import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewCampaignComponent } from './create-new-campaign.component';

describe('CreateNewCampaignComponent', () => {
  let component: CreateNewCampaignComponent;
  let fixture: ComponentFixture<CreateNewCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewCampaignComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateNewCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
