import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindInfluencersComponent } from './find-influencers.component';

describe('FindInfluencersComponent', () => {
  let component: FindInfluencersComponent;
  let fixture: ComponentFixture<FindInfluencersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindInfluencersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindInfluencersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
