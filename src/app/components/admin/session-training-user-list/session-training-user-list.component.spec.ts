import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTrainingUserListComponent } from './session-training-user-list.component';

describe('SessionTrainingUserListComponent', () => {
  let component: SessionTrainingUserListComponent;
  let fixture: ComponentFixture<SessionTrainingUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionTrainingUserListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionTrainingUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
