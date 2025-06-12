// services/training.service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { GetTrainingDto } from '../models/GetTrainingDto';
import { CreateTrainingDto } from '../models/CreateTrainingDto';
import { environment } from '../../../environments/environment.development';
import { GetFitnessCategory } from '../models/GetFitnessCategory ';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  #router = inject(Router);
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'Training/';
  private fitnessCategoryUrl = environment.apiUrl + 'FitnessCategory/';

  $trainings = signal<GetTrainingDto[]>([]);
  $fitnessCategories = signal<GetFitnessCategory[]>([]);
  $error = signal<string>('');

  getAllTrainings(): Observable<GetTrainingDto[]> {
    return this.http.get<GetTrainingDto[]>(this.baseUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  getTraining(id: string): Observable<GetTrainingDto> {
    return this.http.get<GetTrainingDto>(`${this.baseUrl}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  createTraining(training: CreateTrainingDto): Observable<GetTrainingDto> {
    return this.http.post<GetTrainingDto>(this.baseUrl, training).pipe(
      tap(newTraining => {
        // Add the new training to the current trainings list
        const currentTrainings = this.$trainings();
        this.$trainings.set([...currentTrainings, newTraining]);
        this.$error.set('');
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  deleteTraining(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}`).pipe(
      tap(() => {
        const currentTrainings = this.$trainings();
        const filteredTrainings = currentTrainings.filter(training => training.id !== id);
        this.$trainings.set(filteredTrainings);
        this.$error.set('');
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  // Enhanced delete with confirmation
  deleteTrainingWithConfirmation(id: string, trainingName: string): Promise<boolean> {
    return new Promise((resolve) => {
      const confirmed = confirm(`Are you sure you want to delete the training "${trainingName}"? This action cannot be undone.`);

      if (confirmed) {
        this.deleteTraining(id).subscribe({
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

  // Fitness Category methods
  getAllFitnessCategories(): Observable<GetFitnessCategory[]> {
    return this.http.get<GetFitnessCategory[]>(this.fitnessCategoryUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred';

    if (error.status === 400) {
      errorMessage = error.error?.message || 'Invalid data provided';
    } else if (error.status === 404) {
      errorMessage = 'Training not found';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized access';
      this.#router.navigate(['/login']);
    } else if (error.status >= 500) {
      errorMessage = 'Server error occurred';
    }

    this.$error.set(errorMessage);
    console.error(errorMessage, error);
  }

  loadTrainings(): void {
    this.getAllTrainings().subscribe({
      next: (trainings) => this.$trainings.set(trainings),
      error: (error) => this.$error.set('Failed to load trainings')
    });
  }

  loadFitnessCategories(): void {
    this.getAllFitnessCategories().subscribe({
      next: (categories) => this.$fitnessCategories.set(categories),
      error: (error) => this.$error.set('Failed to load fitness categories')
    });
  }


  getTrainingsForFitnessCategory(id: number): Observable<GetTrainingDto[]> {
    return this.http.get<GetTrainingDto[]>(`${this.baseUrl}getTrainingsForFitnessCategory?id=${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }



}
