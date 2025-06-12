// training-add.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../users/services/accountService';
import { Router } from '@angular/router';
import { CreateTrainingDto } from '../models/CreateTrainingDto';
import { TrainingService } from '../services/Training-service';

@Component({
  selector: 'app-training-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './training-add.component.html',
  styleUrl: './training-add.component.css'
})
export class TrainingAddComponent implements OnInit {
  #router = inject(Router);
  accountService = inject(AccountService);
  trainingService = inject(TrainingService);

  trainingForm = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
    numberOfDays: [1, [Validators.required, Validators.min(1)]],
    fitnessCategoryId: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() {
    this.trainingService.loadFitnessCategories();
  }

  submit() {
    if (this.trainingForm.valid) {
      const createTrainingDto: CreateTrainingDto = {
        ...this.trainingForm.value as CreateTrainingDto,
        id: crypto.randomUUID()
      };

      this.trainingService.createTraining(createTrainingDto).subscribe({
        next: () => {
          this.#router.navigate(['admin']);
        },
        error: (error) => {
          console.error('Error creating training:', error);
        }
      });
    }
  }
}
