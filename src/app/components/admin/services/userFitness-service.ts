import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Observable, tap, catchError, throwError } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { CreateUserFitnessPlanDto } from "../models/CreateUserFitnessPlanDto";
import { GetUserFitnessPlanDto } from "../models/GetUserFitnessPlanDto";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserFitnessPlanService {
  #router = inject(Router);
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'UserFitnessPlan/';

  $userFitnessPlans = signal<GetUserFitnessPlanDto[]>([]);
  $error = signal<string>('');
  $isLoading = signal<boolean>(false);

  /**
   * Creates a new user fitness plan
   * This maps to the [HttpPost] CreateUserFitnessPlan() method in C# controller
   * @param userFitnessPlan - The user fitness plan data to create
   * @returns Observable of the created user fitness plan
   */
  createUserFitnessPlan(userFitnessPlan: CreateUserFitnessPlanDto): Observable<GetUserFitnessPlanDto> {
    this.$isLoading.set(true);
    return this.http.post<GetUserFitnessPlanDto>(this.baseUrl, userFitnessPlan).pipe(
      tap(newUserFitnessPlan => {
        // Add the new user fitness plan to the current list
        debugger;
        const currentPlans = this.$userFitnessPlans();
        this.$userFitnessPlans.set([...currentPlans, newUserFitnessPlan]);
        this.$error.set('');
        this.$isLoading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        debugger;
        this.$isLoading.set(false);
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Gets all user fitness plans for the authenticated user
   * This maps to the [HttpGet] GetUserFitnessPlans() method in C# controller
   * @returns Observable of user fitness plans array
   */
  getUserFitnessPlans(): Observable<GetUserFitnessPlanDto[]> {
    this.$isLoading.set(true);
    return this.http.get<GetUserFitnessPlanDto[]>(`${this.baseUrl}GetUserFitnessPlans`).pipe(
      tap(plans => {
        this.$userFitnessPlans.set(plans);
        this.$error.set('');
        this.$isLoading.set(false);
      }),
      catchError((error: HttpErrorResponse) => {
        this.$isLoading.set(false);
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Gets a specific user fitness plan by ID
   * @param id - The ID of the user fitness plan
   * @returns Observable of the user fitness plan
   */
  getUserFitnessPlan(id: string): Observable<GetUserFitnessPlanDto> {
    return this.http.get<GetUserFitnessPlanDto>(`${this.baseUrl}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Updates a user fitness plan
   * @param id - The ID of the user fitness plan to update
   * @param updateDto - The updated data
   * @returns Observable of the updated user fitness plan
   */
  updateUserFitnessPlan(id: string, updateDto: CreateUserFitnessPlanDto): Observable<GetUserFitnessPlanDto> {
    return this.http.put<GetUserFitnessPlanDto>(`${this.baseUrl}${id}`, updateDto).pipe(
      tap(updatedPlan => {
        const currentPlans = this.$userFitnessPlans();
        const updatedPlans = currentPlans.map(plan =>
          plan.id === id ? updatedPlan : plan
        );
        this.$userFitnessPlans.set(updatedPlans);
        this.$error.set('');
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Deletes a user fitness plan
   * @param id - The ID of the user fitness plan to delete
   * @returns Observable of void
   */
  deleteUserFitnessPlan(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}`).pipe(
      tap(() => {
        const currentPlans = this.$userFitnessPlans();
        const filteredPlans = currentPlans.filter(plan => plan.id !== id);
        this.$userFitnessPlans.set(filteredPlans);
        this.$error.set('');
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Enhanced delete with confirmation
   * @param id - The ID of the user fitness plan to delete
   * @param planName - The name of the training plan for confirmation
   * @returns Promise<boolean> - true if deleted, false if cancelled
   */
  deleteUserFitnessPlanWithConfirmation(id: string, planName: string): Promise<boolean> {
    return new Promise((resolve) => {
      const confirmed = confirm(`Are you sure you want to delete the fitness plan "${planName}"? This action cannot be undone.`);

      if (confirmed) {
        this.deleteUserFitnessPlan(id).subscribe({
          next: () => {
            resolve(true);
          },
          error: (error) => {
            resolve(false);
          }
        });
      } else {
        resolve(false);
      }
    });
  }

  /**
   * Loads user fitness plans and updates the signal
   */
  loadUserFitnessPlans(): void {
    this.getUserFitnessPlans().subscribe({
      next: (plans) => this.$userFitnessPlans.set(plans),
      error: (error) => this.$error.set('Failed to load fitness plans')
    });
  }

  /**
   * Clears all signals (useful for logout or component cleanup)
   */
  clearState(): void {
    this.$userFitnessPlans.set([]);
    this.$error.set('');
    this.$isLoading.set(false);
  }

  /**
   * Handles HTTP errors consistently
   * @param error - The HTTP error response
   */
  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred';

    if (error.status === 400) {
      // Bad Request - validation errors
      if (error.error?.errors) {
        // Handle model validation errors
        const validationErrors = Object.values(error.error.errors).flat();
        errorMessage = validationErrors.join(', ');
      } else {
        errorMessage = error.error?.message || 'Invalid data provided';
      }
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized access - please log in';
      this.#router.navigate(['/login']);
    } else if (error.status === 403) {
      errorMessage = 'You do not have permission to perform this action';
    } else if (error.status === 404) {
      errorMessage = 'Fitness plan not found';
    } else if (error.status >= 500) {
      errorMessage = 'Server error occurred - please try again later';
    } else if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    }

    this.$error.set(errorMessage);
    console.error('UserFitnessPlanService Error:', errorMessage, error);
  }

  // Utility methods for component usage

  /**
   * Gets the current error message
   * @returns The current error message or empty string
   */
  getError(): string {
    return this.$error();
  }

  /**
   * Gets the current loading state
   * @returns The current loading state
   */
  getIsLoading(): boolean {
    return this.$isLoading();
  }

  /**
   * Gets the current user fitness plans
   * @returns Array of user fitness plans
   */
  getUserFitnessPlansSignal(): GetUserFitnessPlanDto[] {
    return this.$userFitnessPlans();
  }

  /**
   * Checks if a user has any fitness plans
   * @returns boolean indicating if user has fitness plans
   */
  hasUserFitnessPlans(): boolean {
    return this.$userFitnessPlans().length > 0;
  }

  /**
   * Gets fitness plan by training ID
   * @param trainingId - The training ID to search for
   * @returns The fitness plan or undefined
   */
  getFitnessPlanByTrainingId(trainingId: string): GetUserFitnessPlanDto | undefined {
    return this.$userFitnessPlans().find(plan => plan.trainingId === trainingId);
  }
}
