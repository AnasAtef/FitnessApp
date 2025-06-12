import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnessCategoryListComponent } from './fitness-category-list.component';

describe('FitnessCategoryListComponent', () => {
  let component: FitnessCategoryListComponent;
  let fixture: ComponentFixture<FitnessCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FitnessCategoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FitnessCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
