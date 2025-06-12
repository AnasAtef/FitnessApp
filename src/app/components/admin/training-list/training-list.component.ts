// training-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrainingService } from '../services/Training-service';

@Component({
  selector: 'app-training-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './training-list.component.html',
  styleUrl: './training-list.component.css'
})
export class TrainingListComponent implements OnInit {
  trainingService = inject(TrainingService);

  ngOnInit() {
    this.trainingService.loadTrainings();
    this.trainingService.loadFitnessCategories();
  }

  async deleteTraining(id: string, name: string) {
    const success = await this.trainingService.deleteTrainingWithConfirmation(id, name);
    if (!success) {
      console.log('Training deletion was cancelled or failed');
    }
  }

  getFitnessCategoryName(categoryId: number): string {
    const category = this.trainingService.$fitnessCategories().find(cat => cat.id === categoryId);
    return category?.name || `Category ${categoryId}`;
  }
}
