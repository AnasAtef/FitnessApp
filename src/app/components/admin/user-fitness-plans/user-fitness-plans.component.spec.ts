import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFitnessPlansComponent } from './user-fitness-plans.component';

describe('UserFitnessPlansComponent', () => {
  let component: UserFitnessPlansComponent;
  let fixture: ComponentFixture<UserFitnessPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFitnessPlansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFitnessPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
