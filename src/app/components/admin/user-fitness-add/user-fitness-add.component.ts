// user-fitness-add.component.ts
import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../users/services/accountService';
import { TrainingService } from '../services/Training-service';
import { CreateUserFitnessPlanDto } from '../models/CreateUserFitnessPlanDto';
import { UserFitnessPlanService } from '../services/userFitness-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-fitness-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-fitness-add.component.html',
  styleUrl: './user-fitness-add.component.css'
})
export class UserFitnessAddComponent implements OnInit {
  #router = inject(Router);
  #formBuilder = inject(FormBuilder);

  accountService = inject(AccountService);
  trainingService = inject(TrainingService);
  userFitnessPlanService = inject(UserFitnessPlanService);

  userFitnessPlanForm!: FormGroup;
  selectedCategoryId: number = 0;

  ngOnInit() {
    this.initializeForm();
    this.trainingService.loadFitnessCategories();
  }

  private initializeForm(): void {
    this.userFitnessPlanForm = this.#formBuilder.group({
      trainingId: ['', [Validators.required]],
      fitnessCategoryId: [0, [Validators.required, Validators.min(1)]]
    });

    // Watch for fitness category changes to load trainings
    this.userFitnessPlanForm.get('fitnessCategoryId')?.valueChanges.subscribe(categoryId => {
      if (categoryId && categoryId > 0) {
        this.selectedCategoryId = categoryId;
        this.loadTrainingsForCategory(categoryId);
        // Reset training selection when category changes
        this.userFitnessPlanForm.get('trainingId')?.setValue('');
      }
    });
  }

  private loadTrainingsForCategory(categoryId: number): void {
    this.trainingService.getTrainingsForFitnessCategory(categoryId).subscribe({
      next: (trainings) => {
        this.trainingService.$trainings.set(trainings);
      },
      error: (error) => {
        console.error('Error loading trainings for category:', error);
      }
    });
  }

  submit(): void {
    if (this.userFitnessPlanForm.valid) {
      // Get current user ID from account service
      const currentUser = this.accountService.$currentUser();
      if (!currentUser?._id) {
        debugger
        this.userFitnessPlanService.$error.set('User not authenticated');
        return;
      }

      const createDto: CreateUserFitnessPlanDto = {
        trainingId: this.userFitnessPlanForm.get('trainingId')?.value,
        userId: currentUser._id
      };

      this.userFitnessPlanService.createUserFitnessPlan(createDto).subscribe({
        next: (result) => {
          // Success - navigate to fitness plans list or detail page
          this.#router.navigate(['/userFitnessPlans']);
        },
        error: (error) => {
          console.error('Error creating user fitness plan:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.userFitnessPlanForm.controls).forEach(key => {
        this.userFitnessPlanForm.get(key)?.markAsTouched();
      });
    }
  }

  // Helper method to get trainings for selected category
  getTrainingsForSelectedCategory() {
    return this.trainingService.$trainings();
  }
}
