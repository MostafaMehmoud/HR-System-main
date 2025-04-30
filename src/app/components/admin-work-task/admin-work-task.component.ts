import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TaskDetails } from 'src/app/shared/interfaces/task';
import { TaskService } from 'src/app/shared/services/task.service';
import * as html2pdf from 'html2pdf.js';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-work-task',
  templateUrl: './admin-work-task.component.html',
  styleUrls: ['./admin-work-task.component.css']
})
export class AdminWorkTaskComponent implements OnInit {
  constructor(private _FormBuilder: FormBuilder, private _router: Router, private _TaskService: TaskService, private _TranslateService: TranslateService, private _spinner: NgxSpinnerService) { }
  todayDate: any = new Date().toISOString().split('T')[0]
  nameAr: any = localStorage.getItem('employeeNameAR')
  nameEN: any = localStorage.getItem('employeeNameEN')
  empId: any = ''
  langO: any = localStorage.getItem('myLanguage')
  taskList: TaskDetails[] = []

  showTaskDetails: boolean = false
  dataArrived: boolean = false
  oneTask: TaskDetails = {} as TaskDetails
  visasArray: any[] = []
  tester: boolean = false


  confirmationForm: FormGroup = this._FormBuilder.group({
    readAllDetails: [null, Validators.requiredTrue],
    addDetails: [null],
  })

  get currentLang() {
    return this._TranslateService.currentLang
  }

  ngOnInit(): void {
    this.getAlldata()
    this._TaskService.getBasicData().subscribe({
      next: (Response) => {
        this.nameAr = Response.nameAr
        this.nameEN = Response.nameEn
        this.empId = Response.empId
        console.log(Response);
      },

      error: (err) => {
        console.log(err);
        if (err.error.message == 'Unauthorized') {
          localStorage.clear()
          this._router.navigate(['login'])
        }
      }
    })
  }

  getAlldata() {
    this._TaskService.getAdminRequests('', '3').subscribe({
      next: (data) => {
        console.log(data);
        this.taskList = data.requestJobMissions.reverse()
        this.dataArrived = true
      },
      error: (err) => {
        console.log(err);
      }

    })
  }

  getOneTask(item: TaskDetails) {
    this.oneTask = item
    console.log(item);
    this.oneTask.visas ? this.visasArray = this.oneTask.visas.split(',') : ''
    this.showTaskDetails = true
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100);

  }

  taskDetailsHideShow() {
    this.showTaskDetails = !this.showTaskDetails
    this.confirmationForm.get('readAllDetails')?.setValue(false)
    this.confirmationForm.get('readAllDetails')?.markAsUntouched()
    this.confirmationForm.get('addDetails')?.setValue(null)
  }

  respondToMission(abrovment: any, missionId: any) {
    if (this.confirmationForm.valid) {
      let body = {
        "id": missionId,
        "accepted": abrovment,
        "note": this.confirmationForm.get('addDetails')?.value
      }

      this._TaskService.sendResponse(body).subscribe({
        next: (Responsee) => {
          if (Responsee == true) { // it mean the response send succeful
            //            it mean response was confirm (ok)  --------- it mean response was rejact (No)
            abrovment ? console.log('mission confirmed !') : console.log('mission rejected !')
            this.getAlldata()
            this.confirmSuccsesAlert(abrovment)
          }
        },
        error: (err) => {
          console.log(err);
          console.log('its look something wrong , try again later')
          this.failedAlert()
        }
      })
    }
    else {
      // error with inputs validation
      this.confirmationForm.markAllAsTouched()
    }
  }

  confirmSuccsesAlert(abrovment: any) {
    Swal.fire({
      title: abrovment ? (this.currentLang == 'ar' ? 'تمت الموافقة' : 'Approved') : (this.currentLang == 'ar' ? 'تم ارسال الرفض' : 'Rejection sent'),
      text: abrovment ? (this.currentLang == 'ar' ? 'تم قبول طلب المهمة بنجاح' : 'request has been accepted successfully') : (this.currentLang == 'ar' ? 'تم رفض طلب المهمة بنجاح ' : 'request has been rejected successfully'),
      icon: abrovment ? 'success' : "info",
      confirmButtonColor: '#1a3036',
      confirmButtonText: this.currentLang == 'ar' ? 'موافق' : 'ok',
      customClass: {
        confirmButton: 'btn btn-dark p-3 px-4 mx-0 btn-on-mobile rounded-3 text-white '
      },
    }).then(() => {
      this.taskDetailsHideShow()
    })
  }

  failedAlert() {
    Swal.fire({
      title: this.currentLang == 'ar' ? 'خطأ !' : 'Error',
      text: this.currentLang == 'ar' ? 'ربما يكون هناك خطأ برجاء المحاولة لاحقا' : 'There may be an error, please try again later',
      icon: 'error',
      confirmButtonText: this.currentLang == 'ar' ? 'موافق' : 'ok',
      confirmButtonColor: '#1a3036'
    });
  }
}