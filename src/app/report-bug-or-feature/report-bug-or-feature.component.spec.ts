import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBugOrFeatureComponent } from './report-bug-or-feature.component';

describe('ReportBugOrFeatureComponent', () => {
  let component: ReportBugOrFeatureComponent;
  let fixture: ComponentFixture<ReportBugOrFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportBugOrFeatureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportBugOrFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
