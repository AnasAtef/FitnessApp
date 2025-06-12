import { Routes } from '@angular/router';
import { AdminGuard } from './admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/users/user.routes').then(r => r.userRoutes)
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () => import('./components/admin/admin.routes').then(r => r.adminRoutes)
  }
];
