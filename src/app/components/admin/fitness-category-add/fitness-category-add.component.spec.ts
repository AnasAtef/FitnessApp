import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnessCategoryAddComponent } from './fitness-category-add.component';

describe('FitnessCategoryAddComponent', () => {
  let component: FitnessCategoryAddComponent;
  let fixture: ComponentFixture<FitnessCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitnessCategoryAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FitnessCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
