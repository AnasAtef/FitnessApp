import { Component, inject } from '@angular/core';
import { SessionService } from '../services/session-service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.css'
})
export class SessionListComponent {

  selectedCategoryId: number = 0;

  sessionService = inject(SessionService);

  ngOnInit(): void {
    this.sessionService.getAllSessions();
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }
}
