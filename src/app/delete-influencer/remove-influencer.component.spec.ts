import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveInfluencerComponent } from './remove-influencer.component';

describe('RemoveInfluencerComponent', () => {
  let component: RemoveInfluencerComponent;
  let fixture: ComponentFixture<RemoveInfluencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveInfluencerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemoveInfluencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
