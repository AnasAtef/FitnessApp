import { Routes } from '@angular/router';
import { SignupComponent } from '../users/signup/signup.component';
import { FitnessCategoryListComponent } from './fitness-category-list/fitness-category-list.component';
import { FitnessCategoryAddComponent } from './fitness-category-add/fitness-category-add.component';
import { TrainingAddComponent } from './training-add/training-add.component';
import { TrainingListComponent } from './training-list/training-list.component';
import { UserFitnessAddComponent } from './user-fitness-add/user-fitness-add.component';
import { SessionAddComponent } from './session-add/session-add.component';
import { SessionListComponent } from './session-list/session-list.component';
import { SessionTrainingListComponent } from './session-training-list/session-training-list.component';
import { SessionTrainingAddComponent } from './session-training-add/session-training-add.component';



export const adminRoutes: Routes = [
  { path: '', component: FitnessCategoryListComponent, title: 'fitness Category List' },
  { path: 'addFitnessCategory', component: FitnessCategoryAddComponent, title: 'fitness category' },
  { path: 'addTrainingCategory', component: TrainingAddComponent, title: 'Add Training' },
  { path: 'trainingList', component: TrainingListComponent, title: 'Training list' },
  { path: 'addsessions', component: SessionAddComponent, title: 'add session' },
  { path: 'sessions', component: SessionListComponent, title: 'List Sessions' },
  { path: 'sessionTrainingList', component: SessionTrainingListComponent, title: 'List Training Sessions' },
  { path: 'sessionTrainingAdd', component: SessionTrainingAddComponent, title: 'Add Session Training' }
];
