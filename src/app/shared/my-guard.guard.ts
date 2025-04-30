import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const myGuardGuard: CanActivateFn = (route, state) => {

  let _Router = inject(Router)

  if (localStorage.getItem('userToken') != null && localStorage.getItem('userToken') != 'undefined' ) {
    return true;
  }
  else {
    _Router.navigate(['login'])
    return false
  }
};
