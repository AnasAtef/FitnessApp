import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTrainingListComponent } from './session-training-list.component';

describe('SessionTrainingListComponent', () => {
  let component: SessionTrainingListComponent;
  let fixture: ComponentFixture<SessionTrainingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionTrainingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionTrainingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
