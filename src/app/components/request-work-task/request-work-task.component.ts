import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from './../../shared/services/task.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-request-work-task',
  templateUrl: './request-work-task.component.html',
  styleUrls: ['./request-work-task.component.css']
})
export class RequestWorkTaskComponent {
  constructor(private _FormBuilder: FormBuilder, private _router: Router, private _TaskService: TaskService, private _TranslateService: TranslateService) { }
  pageOpenOne: boolean = false
  todayDate: any = new Date().toISOString().split('T')[0]
  nameAr: any = localStorage.getItem('employeeNameAR')
  nameEN: any = localStorage.getItem('employeeNameEN')
  empId: any = ''

  // ==============   start flags   ===============
  page1: boolean = true
  page2: boolean = false
  moreVisa: boolean = false
  loadButton: boolean = false
  // ==============   end flags   =================

  taskForm: FormGroup = this._FormBuilder.group({
    directionName: [null, Validators.required], // جهة مهمة العمل
    taskDuration: [null, Validators.required], // مدة المهمة
    taskType: [null, Validators.required], // نوع المهمة
    startingDate: [null, Validators.required], //  تاريخ البدء
    EndingDate: [null, Validators.required],// تاريخ الانتهاء
    taskDetails: [null, Validators.required],//  تفاصيل المهمة
    TaskLoan: [''],//  سلفة للمهمة
    tickit: [null],//  تذكرة سفر للمهمة
    visa1: [null],// تأشيرة سفر 1
    visa2: [null],// تأشيرة سفر 2
    visa3: [null],// تأشيرة سفر 3
    visa4: [null],// تأشيرة سفر 4
  })
  // ================== start request prepare ==================
  get directionNameInput() {
    return this.taskForm.get('directionName')
  }
  get taskDurationInput() {
    return this.taskForm.get('taskDuration')
  }
  get taskTypeInput() {
    return this.taskForm.get('taskType')
  }
  get startingDateInput() {
    return this.taskForm.get('startingDate')
  }
  get EndingDateInput() {
    return this.taskForm.get('EndingDate')
  }
  get taskDetailsInput() {
    return this.taskForm.get('taskDetails')
  }

  get currentLang() {
    return this._TranslateService.currentLang
  }

  setMissionRequest() {
    let data: FormData = new FormData()
    data.append('Kind', this.taskTypeInput?.value)
    data.append('Direction', this.directionNameInput?.value)
    data.append('Duration', this.taskDurationInput?.value)
    data.append('FromDate', this.startingDateInput?.value)
    data.append('ToDate', this.EndingDateInput?.value)
    data.append('Details', this.taskDetailsInput?.value)
    data.append('Cost', this.taskForm.get('TaskLoan')?.value)
    data.append('TravelTicket', this.taskForm.get('tickit')?.value)
    data.append('Visas', this.getAllVisas())
    return data
  }
  getAllVisas() {
    let one = this.taskForm.get('visa1')?.value
    let two = this.taskForm.get('visa2')?.value
    let three = this.taskForm.get('visa3')?.value
    let four = this.taskForm.get('visa4')?.value

    let allVisas = []
    one ? allVisas.push(one) : ''
    two ? allVisas.push(two) : ''
    three ? allVisas.push(three) : ''
    four ? allVisas.push(three) : ''
    console.log(allVisas);
    return allVisas.join(',')
  }
  // ==================  end  request prepare ==================

  ngOnInit(): void {
    setTimeout(() => { this.pageOpenOne = true }, 100);
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




  // ================= start > structure - open & close ==================
  nextPage() {
    if (this.directionNameInput?.valid && this.taskDurationInput?.valid && this.taskTypeInput?.valid && this.startingDateInput?.valid && this.EndingDateInput?.valid) {
      this.page1 = false
      this.page2 = true
    }
    else {
      this.directionNameInput?.markAsTouched
      this.taskDurationInput?.markAsTouched
      this.taskTypeInput?.markAsTouched
      this.startingDateInput?.markAsTouched
      this.EndingDateInput?.markAsTouched
    }
  }
  prevPage() {
    this.page2 = false
    this.page1 = true
  }
  addMoreVisa() {
    this.moreVisa = !this.moreVisa
  }
  // =================  end  > structure - open & close ==================








  // ****************** send request **********************
  requestTask() {
    let formStatus = this.taskForm.valid //make sure that form is valid or not & user in the sec page
    if (formStatus && this.page2) {
      this.loadButton = true
      this._TaskService.requestJobMission(this.setMissionRequest()).subscribe({
        next: (Response) => {
          console.log(Response);
          this.loadButton = false
          this.succsesAlert()
        },
        error: (err) => {
          console.log(err);
          this.loadButton = false
          this.failedAlert()
        }
      })
      console.log('request sent .. wait response');
    }

    else {
      console.log('error validation >> check inbuts');
      this.taskForm.markAllAsTouched()
    }
  }


  succsesAlert() {
    Swal.fire({
      title: this.currentLang == 'ar' ? 'تم ارسال الطلب بنجاح' : 'request has been sent successfully',
      text: this.currentLang == 'ar' ? 'يمكنك تفقد حالة الطلب من قسم طلباتي ' : 'check the status of the request in the Requests section',
      icon: 'success',
      confirmButtonColor: '#5ae3a7',
      confirmButtonText: this.currentLang == 'ar' ? 'طلباتي' : 'Requests',
      showCancelButton: true,
      cancelButtonText: this.currentLang == 'ar' ? 'الرئيسية' : 'Home',
      cancelButtonColor: '#1a3036',
      didOpen: () => {
        setTimeout(() => {
          const activeElement = document.activeElement as HTMLElement;
          if (activeElement && typeof activeElement.blur === 'function') {
            activeElement.blur();
          }
        }, 100);
      },
      customClass: {
        cancelButton: 'btn btn-outline-dark p-3 px-4 mx-0 btn-on-mobile rounded-end-3 rounded-start-0 text-white w-50 fww',
        confirmButton: 'btn btn-dark p-3 px-4 mx-0 btn-on-mobile  rounded-start-3  rounded-end-0 text-dark w-50 '
      },

    }).then((result) => {
      if (result.isConfirmed) {
        this._router.navigate(['allOrders'])
      }
      else if (result.isDismissed) {
        this._router.navigate(['home'])
      }
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
