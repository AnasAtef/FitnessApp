import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFitnessAddComponent } from './user-fitness-add.component';

describe('UserFitnessAddComponent', () => {
  let component: UserFitnessAddComponent;
  let fixture: ComponentFixture<UserFitnessAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFitnessAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFitnessAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
