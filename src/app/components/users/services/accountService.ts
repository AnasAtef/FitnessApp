import { inject, Injectable, signal } from "@angular/core";
import { User } from "../models/user";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment.development";
import { RegisterUser } from "../models/RegisterUser";
import { RegistrationResponse } from "../models/RegistrationResponse ";
import { ValidationErrorResponse } from "../models/ValidationErrorResponse ";
import { LoginResponse, LoginUser } from "../models/loginUser";


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  #router = inject(Router);

  private emptyUser: User = {
    userName: '',
    email: '',
    role: ''
  }

  private http = inject(HttpClient);

  private baseUrl = environment.apiUrl;

  $currentUser = signal<User>(this.emptyUser);
  $token = signal<string>('');

  $error = signal<string>('');

  register(model: RegisterUser) {
    this.http.post<RegistrationResponse>(this.baseUrl + 'Account/register', model).subscribe(
      (res: RegistrationResponse) => {
        this.setCurrentUser(res.token as string);
        this.$error.set('');
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          const validationErrors = error.error as ValidationErrorResponse;
          if (validationErrors.errors) {
            const errorMessages: string[] = [];
            Object.keys(validationErrors.errors).forEach(key => {
              errorMessages.push(...validationErrors.errors[key]);
            });
            this.$error.set(errorMessages.join(', '));
          }
        } else {
          this.$error.set('Registration failed');
        }
      }
    )
  }

  setCurrentUser(token: string) {
    localStorage.setItem('user', token);
    this.$token.set(token);
    const user = this.getDecodedToken(token);
    this.$currentUser.set(user);
    if (this.$currentUser().role?.toLowerCase() == "admin") {
      this.#router.navigate(["userFitnessPlans"]);
    } else {
      this.#router.navigate(['admin', "addFitnessCategory"]);
    }

  }

  getDecodedToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: User = {
        _id: payload.nameid || payload.sub || '',
        userName: payload.unique_name || payload.name || '',
        email: payload.email || '',
        role: payload.role || '',
        nameid: payload.nameid,
        unique_name: payload.unique_name
      };

      return user;
    } catch (error) {
      console.error('Error decoding token:', error);
      return this.emptyUser;
    }
  }

  signin(model: LoginUser) {
    this.http.post<LoginResponse>(this.baseUrl + 'Account/login', model).subscribe(
      (res: LoginResponse) => {
        this.setCurrentUser(res.token as string);
        this.$error.set('');
        this.#router.navigate(['', 'userFitnessPlans'])
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - invalid credentials
          this.$error.set('Invalid email or password');
        } else if (error.status === 400) {
          // Validation errors
          const validationErrors = error.error as ValidationErrorResponse;
          if (validationErrors.errors) {
            const errorMessages: string[] = [];
            Object.keys(validationErrors.errors).forEach(key => {
              errorMessages.push(...validationErrors.errors[key]);
            });
            this.$error.set(errorMessages.join(', '));
          } else {
            this.$error.set('Login failed');
          }
        } else {
          this.$error.set('Login failed');
        }
      }
    )
  }

  logout() {
    localStorage.removeItem('user');
    this.$token.set('');
    this.$currentUser.set(this.emptyUser);
    this.$error.set('');
    this.#router.navigate(['/signin']);
  }

}
