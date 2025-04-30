import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { adminOrderLoan, adminOrderVacation, loanInterface, Response } from 'src/app/shared/interfaces/response';
import { AdminService } from 'src/app/shared/services/admin.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-vacation',
  templateUrl: './admin-vacation.component.html',
  styleUrls: ['./admin-vacation.component.css']
})
export class AdminVacationComponent implements OnInit {
  constructor(private _AdminService: AdminService, private _router: Router, private _ToastrService: ToastrService) { }

  ordersCount: number = 0
  vacationOrdersList: adminOrderVacation[] = []
  slideAndHide: boolean = false
  pageOpenOne: boolean = false



  ngOnInit(): void {
    if (localStorage.getItem('userToken') == (null || undefined)) {
      this._router.navigate(['login'])
    }
    setTimeout(() => { this.pageOpenOne = true }, 100);

    this._AdminService.getAllRequestVacation().subscribe({
      next: (data) => {
        this.ordersCount = data.count
        this.vacationOrdersList = data.requestVacations
        this.vacationOrdersList = this.vacationOrdersList.reverse()
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

  actionRequest(orderId: number, action: boolean, details: string = '', oneItem: HTMLElement) {
    this._AdminService.vacationAction(orderId, action, details).subscribe({




      next: (Response) => {
        if (Response == true) {// هنا تعني انه تم القبول او تم الرفض بدون مشاكل
          console.log(Response);

          if (action == true) { // هنا لو كان الزرار قبول يحرك العنصر يمين 
            this._ToastrService.success('تم قبول الطلب بنجاح ')
            oneItem.classList.add('beSmallAndHideR')
            setTimeout(() => { oneItem.classList.add('d-none') }, 500)
          }
          else { // هنا لو كان الزرار رفض يحرك العنصر يسار 
            this._ToastrService.error('تم رفض الطلب')
            oneItem.classList.add('beSmallAndHideL')
            setTimeout(() => { oneItem.classList.add('d-none') }, 500)

          }
        }
      },


      error: (err) => {
        console.log(err);
        if (err.error.message == 'Total Allowance Days : 21 , Employee 1061 took 21 Before') {
          this._ToastrService.warning('استهلك الموظف كامل رصيده من الاجازات المستحقة', ' لا يوجد رصيد اجازات متاح')
        }
      }
    })


  }


}

