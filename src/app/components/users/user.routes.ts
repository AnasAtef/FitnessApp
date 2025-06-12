import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { UserFitnessAddComponent } from '../admin/user-fitness-add/user-fitness-add.component';
import { UserFitnessPlansComponent } from '../admin/user-fitness-plans/user-fitness-plans.component';
import { SessionTrainingListComponent } from '../admin/session-training-list/session-training-list.component';
import { SessionTrainingUserListComponent } from '../admin/session-training-user-list/session-training-user-list.component';
import { ExercisesComponent } from '../exercises/exercises.component';
import { Exercise1Component } from '../exercise1/exercise1.component';


export const userRoutes: Routes = [
  { path: '', component: SignupComponent, title: 'signup' },
  { path: 'signin', component: SigninComponent, title: 'signin' },
  { path: 'userDetailsAdd', component: UserFitnessAddComponent, title: 'User Data' },
  { path: 'userFitnessPlans', component: UserFitnessPlansComponent, title: 'user fitness plans' },
  { path: 'sessionTrainingList/:trainingId', component: SessionTrainingUserListComponent, title: 'List Training Sessions' },
  { path: 'exercises', component: ExercisesComponent, title: 'exercises' },
  { path: 'exercise', component: Exercise1Component, title: 'exercise' }

];
