import { APP_INITIALIZER, ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AccountService } from './components/users/services/accountService';
import { jwtInterceptor } from './components/users/services/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideAnimationsAsync(),
  provideRouter(routes, withViewTransitions(),
    withPreloading(PreloadAllModules),
    withComponentInputBinding()),
  provideHttpClient(withInterceptors([jwtInterceptor])),
  provideClientHydration(),
  { provide: APP_INITIALIZER, useFactory: bootstrap, multi: true }]
};

function bootstrap() {
  const accountService = inject(AccountService);

  return () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token: string | null = localStorage.getItem('user');
      if (token) {
        accountService.setCurrentUser(token);
      }
    }
  };
}
