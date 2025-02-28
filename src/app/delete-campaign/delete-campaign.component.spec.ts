import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCampaignComponent } from './delete-campaign.component';

describe('DeleteCampaignComponent', () => {
  let component: DeleteCampaignComponent;
  let fixture: ComponentFixture<DeleteCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCampaignComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
