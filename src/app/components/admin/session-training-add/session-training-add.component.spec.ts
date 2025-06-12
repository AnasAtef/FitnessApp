import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTrainingAddComponent } from './session-training-add.component';

describe('SessionTrainingAddComponent', () => {
  let component: SessionTrainingAddComponent;
  let fixture: ComponentFixture<SessionTrainingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionTrainingAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionTrainingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
