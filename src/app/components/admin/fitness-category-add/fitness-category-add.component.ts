import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FitnessCategory } from '../../users/models/fitnessCategory';
import { AccountService } from '../../users/services/accountService';
import { Router } from '@angular/router';
import { CreateFitnessCategoryDto } from '../models/CreateFitnessCategoryDto ';
import { FitnessCategoryService } from '../services/fitness-category-service';

@Component({
  selector: 'app-fitness-category-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './fitness-category-add.component.html',
  styleUrl: './fitness-category-add.component.css'
})
export class FitnessCategoryAddComponent {
  #router = inject(Router);
  accountService = inject(AccountService);
  fitnessCategoryService = inject(FitnessCategoryService);


  fitnessCategoryForm = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.minLength(6)]]
  });


  submit() {
    if (this.fitnessCategoryForm.valid) {
      debugger
      const createFitnessCategoryDto: CreateFitnessCategoryDto = { ...this.fitnessCategoryForm.value as CreateFitnessCategoryDto };
      this.fitnessCategoryService.createCategory(createFitnessCategoryDto).subscribe(()=>{
        this.#router.navigate(['admin']);
      });
    }
  }
}
