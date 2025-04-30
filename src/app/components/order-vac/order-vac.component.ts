import { Component, OnInit } from '@angular/core';
import { LoanService } from 'src/app/shared/services/loan.service';
import { Router } from '@angular/router';
import { loanInterface, vacationInterface } from 'src/app/shared/interfaces/response';
import { VacationService } from 'src/app/shared/services/vacation.service';

@Component({
  selector: 'app-order-vac',
  templateUrl: './order-vac.component.html',
  styleUrls: ['./order-vac.component.css']
})
export class OrderVacComponent implements OnInit {
  constructor(private _VacationService: VacationService, private _router: Router) { }

  ordersList: vacationInterface[] = []

  ngOnInit(): void {
    this._VacationService.getAllvacations().subscribe({
      next: (data) => {
        this.ordersList = data.requestVacations
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
