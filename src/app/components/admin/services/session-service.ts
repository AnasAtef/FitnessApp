import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { CreateSessionDto, GetSessionDto } from '../models/session.model';
import { ValidationErrorResponse } from '../../users/models/ValidationErrorResponse ';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  #router = inject(Router);

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  $sessions = signal<GetSessionDto[]>([]);
  $error = signal<string>('');
  $loading = signal<boolean>(false);

  /**
   * Create a new session
   */
  createSession(model: CreateSessionDto) {
    this.$loading.set(true);
    this.http.post<GetSessionDto>(this.baseUrl + 'session', model).subscribe(
      (res: GetSessionDto) => {
        this.$error.set('');
        this.$loading.set(false);

        // Navigate back to sessions list
        this.#router.navigate(['sessions']);
      },
      (error: HttpErrorResponse) => {
        this.$loading.set(false);
        this.handleError(error);
      }
    );
  }

  /**
   * Get all sessions
   */
  getAllSessions() {
    this.$loading.set(true);
    this.http.get<GetSessionDto[]>(this.baseUrl + 'session').subscribe(
      (res: GetSessionDto[]) => {
        this.$sessions.set(res);
        this.$error.set('');
        this.$loading.set(false);
      },
      (error: HttpErrorResponse) => {
        this.$loading.set(false);
        this.handleError(error);
      }
    );
  }

  /**
   * Handle HTTP errors
   */
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
        this.$error.set('Bad request. Please check your input.');
      }
    } else if (error.status === 401) {
      this.$error.set('Unauthorized. Please log in again.');
    } else if (error.status === 404) {
      this.$error.set('Session not found.');
    } else if (error.status === 500) {
      this.$error.set('Internal server error. Please try again later.');
    } else {
      if (error.error && typeof error.error === 'string') {
        this.$error.set(error.error);
      } else if (error.error && error.error.message) {
        this.$error.set(error.error.message);
      } else {
        this.$error.set('An unexpected error occurred. Please try again.');
      }
    }
  }
}
