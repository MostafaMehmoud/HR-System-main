import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/shared/services/loan.service';
import { Router } from '@angular/router';
import { loanInterface } from 'src/app/shared/interfaces/response';

@Component({
  selector: 'app-orderloan',
  templateUrl: './orderloan.component.html',
  styleUrls: ['./orderloan.component.css']
})
export class OrderloanComponent implements OnInit {
  constructor(private _LoanService: LoanService, private _router: Router) { }

  ordersList: loanInterface[] = []

  ngOnInit(): void {
    if(localStorage.getItem('userToken') == (null || undefined)){
      this._router.navigate(['login'])
    }
    this._LoanService.getAllLoan().subscribe({
      next: (data) => {
        this.ordersList = data.advancePayments.reverse()
        console.log(this.ordersList);
      },
      error: (err) => {
        console.log(err);
        if (err.error.message == 'Unauthorized') {
          localStorage.clear()
          this._router.navigate(['login'])
        }
      },
    })
  }

}
