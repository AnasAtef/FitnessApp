import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LoginUser } from '../../users/models/loginUser';
import { AccountService } from '../../users/services/accountService';
import { FitnessCategory } from '../../users/models/fitnessCategory';
import { Router, RouterLink } from '@angular/router';
import { FitnessCategoryService } from '../services/fitness-category-service';

@Component({
  selector: 'app-fitness-category-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './fitness-category-list.component.html',
  styleUrl: './fitness-category-list.component.css'
})
export class FitnessCategoryListComponent {
  #router = inject(Router);
  fitnessCategoryService = inject(FitnessCategoryService);

  constructor() {
    this.fitnessCategoryService.loadCategories();
    console.log(this.fitnessCategoryService.$categories());
  }

deleteCategory(categoryId: number): void {
  this.fitnessCategoryService.deleteCategory(categoryId).subscribe({
    next: () => {
      console.log('Category deleted successfully');
    },
    error: (error) => {
      console.error('Error deleting category:', error);
    }
  });
}


}
