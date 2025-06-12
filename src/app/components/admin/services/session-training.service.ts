// session-training.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ValidationErrorResponse } from '../../users/models/ValidationErrorResponse ';
import { GetSessionDto } from '../models/session.model';

export interface CreateSessionTrainingDto {
  // Add properties based on your requirements
  trainingId: string;
  sessionId: string;
  sequenceNumber:number;
  // Add other properties as needed
}

export interface GetSessionTraining {
  id: string;
  trainingId: string;
  sessionName: string;
  createdDate: Date;
  // Add other properties as needed
}

export interface GetSessionTrainingDetailsDto {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SessionTrainingService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // Signals for state management
  $sessionsTraining = signal<GetSessionDto[]>([]);
  $isLoading = signal<boolean>(false);
  $error = signal<string>('');

  // Create a new session training
  createSessionTraining(model: CreateSessionTrainingDto) {
    this.$isLoading.set(true);
    this.$error.set('');

    this.http.post<GetSessionTraining>(this.baseUrl + 'SessionTraining', model).subscribe(
      (res: GetSessionTraining) => {
        this.$isLoading.set(false);
        this.$error.set('');
        // Optionally trigger a refresh of sessions list
        console.log('Session training created successfully:', res);
      },
      (error: HttpErrorResponse) => {
        this.$isLoading.set(false);
        this.handleError(error);
      }
    );
  }

  // Get sessions by training ID
  loadSessionsByTrainingId(trainingId: string) {
    this.$isLoading.set(true);
    this.$error.set('');

    const params = new HttpParams().set('Id', trainingId);

    this.http.get<GetSessionDto[]>(`${this.baseUrl}SessionTraining/${trainingId}`).subscribe(
      (res: GetSessionDto[]) => {
        this.$sessionsTraining.set(res);
        this.$isLoading.set(false);
        this.$error.set('');
      },
      (error: HttpErrorResponse) => {
        this.$isLoading.set(false);
        this.$sessionsTraining.set([]);
        this.handleError(error);
      }
    );
  }

  // Clear state
  clearState(): void {
    this.$sessionsTraining.set([]);
    this.$isLoading.set(false);
    this.$error.set('');
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      const validationErrors = error.error as ValidationErrorResponse;
      if (validationErrors.errors) {
        const errorMessages: string[] = [];
        Object.keys(validationErrors.errors).forEach(key => {
          errorMessages.push(...validationErrors.errors[key]);
        });
        this.$error.set(errorMessages.join(', '));
      } else {
        this.$error.set('Request failed');
      }
    } else if (error.status === 404) {
      this.$error.set('Sessions not found');
    } else if (error.status === 500) {
      this.$error.set('Server error occurred');
    } else {
      this.$error.set('Failed to load sessions');
    }
  }




}
