import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService } from '../../users/services/accountService';
import { TrainingService } from '../services/Training-service';
import { UserFitnessPlanService } from '../services/userFitness-service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GetSessionTrainingDetailsDto, SessionTrainingService } from '../services/session-training.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session-training-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './session-training-list.component.html',
  styleUrl: './session-training-list.component.css'
})
export class SessionTrainingListComponent implements OnInit {

  #router = inject(Router);
  #route = inject(ActivatedRoute);

  accountService = inject(AccountService);
  trainingService = inject(TrainingService);
  sessionTrainingService = inject(SessionTrainingService);
  userFitnessPlanForm!: FormGroup;
  selectedCategoryId: number = 0;
  // Component state
  trainingId: string = '';


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

  ngOnInit(): void {
    this.trainingService.loadFitnessCategories();
  }

  onFitnessCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const categoryId = Number(target.value);
    this.loadTrainings(categoryId);
  }

  onTrainingChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const trainingId = target.value;
    this.sessionTrainingService.loadSessionsByTrainingId(trainingId);
  }

  private loadTrainings(categoryId: number) {
    if (categoryId && categoryId > 0) {
      this.selectedCategoryId = categoryId;
      this.loadTrainingsForCategory(categoryId);
      // Reset training selection when category changes
      // this.userFitnessPlanForm.get('trainingId')?.setValue('');
    }
  }
  getTrainingsForSelectedCategory() {
    return this.trainingService.$trainings();
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

}
