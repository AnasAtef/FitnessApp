import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingAddComponent } from './training-add.component';

describe('TrainingAddComponent', () => {
  let component: TrainingAddComponent;
  let fixture: ComponentFixture<TrainingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
