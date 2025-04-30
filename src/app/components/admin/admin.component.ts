import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { adminOrderLoan, loanInterface } from 'src/app/shared/interfaces/response';
import { AdminService } from 'src/app/shared/services/admin.service';
import { LoanService } from 'src/app/shared/services/loan.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private _router: Router) { }


  ngOnInit(): void {
    if (localStorage.getItem('userToken') == (null || undefined)) {
      this._router.navigate(['login'])
    }

  }
}
