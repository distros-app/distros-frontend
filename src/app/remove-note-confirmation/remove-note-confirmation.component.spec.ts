import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveNoteConfirmationComponent } from './remove-note-confirmation.component';

describe('RemoveNoteConfirmationComponent', () => {
  let component: RemoveNoteConfirmationComponent;
  let fixture: ComponentFixture<RemoveNoteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveNoteConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemoveNoteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
