import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInfluencerToListComponent } from './add-influencer-to-list.component';

describe('AddInfluencerToListComponent', () => {
  let component: AddInfluencerToListComponent;
  let fixture: ComponentFixture<AddInfluencerToListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInfluencerToListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddInfluencerToListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
