// user-fitness-plans.component.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { GetUserFitnessPlanDto } from '../models/GetUserFitnessPlanDto';
import { UserFitnessPlanService } from '../services/userFitness-service';

@Component({
  selector: 'app-user-fitness-plans',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-fitness-plans.component.html',
  styleUrl: './user-fitness-plans.component.css'
})
export class UserFitnessPlansComponent implements OnInit, OnDestroy {
  #router = inject(Router);
  userFitnessPlanService = inject(UserFitnessPlanService);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadUserFitnessPlans();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load user fitness plans from the API
   */
  private loadUserFitnessPlans(): void {
    this.userFitnessPlanService.getUserFitnessPlans()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (plans) => {
          // Plans are automatically set in the service signal
          console.log('Loaded fitness plans:', plans);
        },
        error: (error) => {
          console.error('Error loading fitness plans:', error);
        }
      });
  }

  /**
   * Navigate to create new fitness plan
   */
  createNewPlan(): void {
    this.#router.navigate(['/userDetailsAdd']);
  }



  /**
   * Delete a fitness plan with confirmation
   */
  async deletePlan(plan: GetUserFitnessPlanDto): Promise<void> {
    const deleted = await this.userFitnessPlanService.deleteUserFitnessPlanWithConfirmation(
      plan.id,
      plan.trainingName
    );

    if (deleted) {
      console.log('Fitness plan deleted successfully');
    }
  }



  /**
   * Get the current fitness plans from the service signal
   */
  get fitnessPlans(): GetUserFitnessPlanDto[] {
    return this.userFitnessPlanService.$userFitnessPlans();
  }

  /**
   * Get the current error from the service signal
   */
  get error(): string {
    return this.userFitnessPlanService.$error();
  }

  /**
   * Get the current loading state from the service signal
   */
  get isLoading(): boolean {
    return this.userFitnessPlanService.$isLoading();
  }

  /**
   * Check if user has any fitness plans
   */
  get hasPlans(): boolean {
    return this.userFitnessPlanService.hasUserFitnessPlans();
  }

  /**
   * Get formatted duration text
   */
  getDurationText(numberOfDays: number): string {
    if (numberOfDays === 1) {
      return '1 day';
    }
    return `${numberOfDays} days`;
  }

  /**
   * Get category badge color class based on category name
   */
  getCategoryBadgeClass(categoryName: string): string {
    const lowerCaseName = categoryName.toLowerCase();

    if (lowerCaseName.includes('strength') || lowerCaseName.includes('weight')) {
      return 'badge-strength';
    } else if (lowerCaseName.includes('cardio') || lowerCaseName.includes('endurance')) {
      return 'badge-cardio';
    } else if (lowerCaseName.includes('flexibility') || lowerCaseName.includes('yoga')) {
      return 'badge-flexibility';
    } else if (lowerCaseName.includes('sports') || lowerCaseName.includes('functional')) {
      return 'badge-sports';
    }

    return 'badge-default';
  }
}
