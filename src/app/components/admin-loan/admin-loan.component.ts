import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { adminOrderLoan, loanInterface } from 'src/app/shared/interfaces/response';
import { AdminService } from 'src/app/shared/services/admin.service';
import { LoanService } from 'src/app/shared/services/loan.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-loan',
  templateUrl: './admin-loan.component.html',
  styleUrls: ['./admin-loan.component.css']
})
export class AdminLoanComponent {
  constructor(private _AdminService: AdminService, private _router: Router , private _ToastrService:ToastrService) { }

  ordersCount: number = 0
  LoanordersList: adminOrderLoan[] = []
  pageOpenOne:boolean = false




  ngOnInit(): void {

    setTimeout(() => { this.pageOpenOne = true }, 0);
    this._AdminService.getAllRequestLoan().subscribe({
      next: (data) => {
        this.ordersCount = data.count
        this.LoanordersList = data.requestAdvancePayments
        this.LoanordersList = this.LoanordersList.reverse()
        console.log(this.ordersCount);
        console.log(this.LoanordersList);
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

  
  actionRequest(orderId: number, action: boolean, oneItem: HTMLElement) {
    if(localStorage.getItem('userToken') == (null || undefined)){
      this._router.navigate(['login'])
    }
    this._AdminService.LoanAction(orderId, action).subscribe({

      next: (Response) => {
        if (Response == true) {
          console.log(Response);
          if (action == true) {
            this._ToastrService.success('تم قبول الطلب بنجاح ')
            oneItem.classList.add('beSmallAndHideR')
            setTimeout(() => { oneItem.classList.add('d-none') }, 500)

          }
          else {
            this._ToastrService.error('تم رفض الطلب')
            oneItem.classList.add('beSmallAndHideL')
            setTimeout(() => { oneItem.classList.add('d-none') }, 500)

          }
        }
      },






      error: (err) => {
        console.log(err);
      }




    })
  }
}
