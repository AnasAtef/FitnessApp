import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../users/services/accountService';
import { SessionTrainingService, CreateSessionTrainingDto } from '../services/session-training.service';
import { TrainingService } from '../services/Training-service';
import { SessionService } from '../services/session-service';

@Component({
  selector: 'app-session-training-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './session-training-add.component.html',
  styleUrl: './session-training-add.component.css'
})
export class SessionTrainingAddComponent {

  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #formBuilder = inject(FormBuilder);

  accountService = inject(AccountService);
  trainingService = inject(TrainingService);
  sessionTrainingService = inject(SessionTrainingService);
  sessionService = inject(SessionService);

  userFitnessPlanForm!: FormGroup;
  selectedCategoryId: number = 0;
  isSubmitting: boolean = false;

  ngOnInit(): void {
    this.initializeForm();
    this.trainingService.loadFitnessCategories();
    this.sessionService.getAllSessions();
  }

  private initializeForm(): void {
    this.userFitnessPlanForm = this.#formBuilder.group({
      fitnessCategoryId: [0, [Validators.required, Validators.min(1)]],
      trainingId: ['', [Validators.required]],
      sessionId: ['', [Validators.required]],
      sequenceNumber: [1, [Validators.required, Validators.min(1)]]
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

  onFitnessCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const categoryId = Number(target.value);
    this.loadTrainings(categoryId);
  }

  private loadTrainings(categoryId: number) {
    if (categoryId && categoryId > 0) {
      this.selectedCategoryId = categoryId;
      this.loadTrainingsForCategory(categoryId);
      // Reset training selection when category changes
      this.userFitnessPlanForm.get('trainingId')?.setValue('');
    } else {
      this.selectedCategoryId = 0;
      this.trainingService.$trainings.set([]);
      this.userFitnessPlanForm.get('trainingId')?.setValue('');
    }
  }

  getTrainingsForSelectedCategory() {
    return this.trainingService.$trainings();
  }

  onSubmit(): void {
    if (this.userFitnessPlanForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.userFitnessPlanForm.value;

      const createSessionTrainingDto: CreateSessionTrainingDto = {
        sessionId: formValue.sessionId,
        trainingId: formValue.trainingId,
        sequenceNumber: formValue.sequenceNumber
      };

      this.sessionTrainingService.createSessionTraining(createSessionTrainingDto);


  }
}



  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userFitnessPlanForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.userFitnessPlanForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['min']) {
        return `Please select a valid ${this.getFieldDisplayName(fieldName).toLowerCase()}`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'fitnessCategoryId': 'Fitness Category',
      'trainingId': 'Training Program',
      'sessionId': 'Session',
      'sequenceNumber': 'Sequence Number'
    };
    return displayNames[fieldName] || fieldName;
  }

  onCancel(): void {
    this.#router.navigate(['/training-sessions']); // Adjust route as needed
  }
}
