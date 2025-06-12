import { Component, computed, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../../users/services/accountService';
import { SessionTrainingService } from '../services/session-training.service';
import { TrainingService } from '../services/Training-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-session-training-user-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './session-training-user-list.component.html',
  styleUrl: './session-training-user-list.component.css'
})
export class SessionTrainingUserListComponent implements OnInit {

  ngOnInit(): void {
    const trainingId = this.trainingId();
    if (trainingId) {
      this.sessionTrainingService.loadSessionsByTrainingId(trainingId);
    }
  }

  #router = inject(Router);
  #route = inject(ActivatedRoute);

  private route = inject(ActivatedRoute);

  routeParams = toSignal(this.route.paramMap);

  trainingId = computed(() => {
    return this.routeParams()?.get('trainingId') || null;
  });

  accountService = inject(AccountService);
  trainingService = inject(TrainingService);
  sessionTrainingService = inject(SessionTrainingService);
  userFitnessPlanForm!: FormGroup;
  selectedCategoryId: number = 0;



  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

}
