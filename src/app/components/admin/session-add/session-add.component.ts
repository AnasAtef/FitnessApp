import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateSessionDto } from '../models/session.model';
import { SessionService } from '../services/session-service';

@Component({
  selector: 'app-session-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './session-add.component.html',
  styleUrl: './session-add.component.css'
})
export class SessionAddComponent {

  private fb = inject(FormBuilder);
  sessionService = inject(SessionService);

  sessionForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    minutes: ['', [Validators.required, Validators.min(1), Validators.max(300)]],
    numberOfSets: ['', [Validators.required, Validators.min(1), Validators.max(20)]],
    imageUrl: ['', Validators.pattern(/^(https?:\/\/.+\.(jpg|jpeg|png|gif|webp)|[a-zA-Z]:[\\\/].+\.(jpg|jpeg|png|gif|webp)|[\/~].+\.(jpg|jpeg|png|gif|webp))$/i)]
  });

  submit(): void {
    if (this.sessionForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const sessionData: CreateSessionDto = this.sessionForm.value;
    this.sessionService.createSession(sessionData);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.sessionForm.controls).forEach(key => {
      const control = this.sessionForm.get(key);
      control?.markAsTouched();
    });
  }


}
