import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewListComponent } from './create-new-list.component';

describe('CreateNewListComponent', () => {
  let component: CreateNewListComponent;
  let fixture: ComponentFixture<CreateNewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateNewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
