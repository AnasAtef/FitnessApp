import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from './accountService';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  if (accountService.$token() !== '') {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accountService.$token()}` // ⭐ Added "Bearer " prefix
      }
    });
  }

  return next(req);
};
