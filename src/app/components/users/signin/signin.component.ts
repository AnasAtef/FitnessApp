import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginUser } from '../models/loginUser';
import { Router } from '@angular/router';
import { AccountService } from '../services/accountService';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

  #router = inject(Router);
  accountService = inject(AccountService);


  signinForm = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  submit() {
    if (this.signinForm.valid) {
      debugger;
      const signUser: LoginUser = { ...this.signinForm.value as LoginUser };
      this.accountService.signin(signUser);
    }
  }
}
