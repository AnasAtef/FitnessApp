import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment.development";
import { Observable, catchError, tap, throwError } from "rxjs";
import { FitnessCategory } from "../models/fitnessCategory";
import { CreateFitnessCategoryDto } from "../models/CreateFitnessCategoryDto ";
import { GetFitnessCategory } from "../models/GetFitnessCategory ";

@Injectable({
  providedIn: 'root'
})
export class FitnessCategoryService {
  #router = inject(Router);
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'FitnessCategory/';

  $categories = signal<FitnessCategory[]>([]);
  $error = signal<string>('');

  getAllCategories(): Observable<FitnessCategory[]> {
    return this.http.get<FitnessCategory[]>(this.baseUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  getCategoryById(id: number): Observable<FitnessCategory> {
    return this.http.get<FitnessCategory>(`${this.baseUrl}${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

    createCategory(category: CreateFitnessCategoryDto): Observable<GetFitnessCategory> {
    return this.http.post<GetFitnessCategory>(this.baseUrl, category).pipe(
      tap(newCategory => {
        // Add the new category to the current categories list
        const currentCategories = this.$categories();
        this.$categories.set([...currentCategories, newCategory]);
        this.$error.set('');
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  updateCategory(id: number, category: FitnessCategory): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}${id}`, category).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}`).pipe(
      tap(() => {
        const currentCategories = this.$categories();
        const filteredCategories = currentCategories.filter(cat => cat.id !== id);
        this.$categories.set(filteredCategories);
        this.$error.set('');
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  // Enhanced delete with confirmation
  deleteCategoryWithConfirmation(id: number, categoryName: string): Promise<boolean> {
    return new Promise((resolve) => {
      const confirmed = confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`);

      if (confirmed) {
        this.deleteCategory(id).subscribe({
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

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred';

    if (error.status === 400) {
      // Bad Request - validation errors
      errorMessage = error.error?.message || 'Invalid data provided';
    } else if (error.status === 404) {
      errorMessage = 'Category not found';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized access';
      this.#router.navigate(['/login']);
    } else if (error.status >= 500) {
      errorMessage = 'Server error occurred';
    }

    this.$error.set(errorMessage);
    console.error(errorMessage, error);
  }

  loadCategories(): void {
    this.getAllCategories().subscribe({
      next: (categories) => this.$categories.set(categories),
      error: (error) => this.$error.set('Failed to load categories')
    });
  }
}
