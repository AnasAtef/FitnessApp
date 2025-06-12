import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AccountService } from "./components/users/services/accountService";

export const AdminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  const currentUser = accountService.$currentUser();
  console.log(currentUser?.role?.toLowerCase());
  debugger;
  if (currentUser?.role?.toLowerCase() === 'administrator') {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
