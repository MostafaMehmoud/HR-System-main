import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuardGuard: CanActivateFn = (route, state) => {
let _Router = inject(Router)

  if (localStorage.getItem('userToken') != null && localStorage.getItem('userToken') != 'undefined' && localStorage.getItem('userRole') == 'an_tripple_of_h3b5y5tyb2FX') {
    return true;
  }
  else {
    _Router.navigate(['login'])
    return false
  }


};
