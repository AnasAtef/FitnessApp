import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterUser } from '../models/RegisterUser';
import { Router } from '@angular/router';
import { AccountService } from '../services/accountService';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  #router = inject(Router);
  accountService = inject(AccountService);

  constructor() {
    effect(() => {
      if (this.accountService.$currentUser().userName !== '') {
        this.#router.navigate(['users', 'signup']);
      }
    });
  }

  signupForm = inject(FormBuilder).nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    weight: [null as number | null, [Validators.required, Validators.min(1), Validators.max(1000)]],
    age: [null as number | null, [Validators.required, Validators.min(13), Validators.max(120)]],
    height: [null as number | null, [Validators.required, Validators.min(100), Validators.max(200)]],
    genderId: ['', [Validators.required]]
  });

  submit() {
    if (this.signupForm.valid) {
      debugger;
      const signUser: RegisterUser = { ...this.signupForm.value as RegisterUser };
      this.accountService.register(signUser);
      this.#router.navigate(['', 'userFitnessPlans']);
    }
  }
}
