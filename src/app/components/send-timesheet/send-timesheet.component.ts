import { Time } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';
import { Router } from '@angular/router';
import { CalcEarlyPipe } from 'src/app/shared/calc-early.pipe';
import { Response } from './../../shared/interfaces/response';
import { debounceTime } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-send-timesheet',
  templateUrl: './send-timesheet.component.html',
  styleUrls: ['./send-timesheet.component.css']
})
export class SendTimesheetComponent {
  constructor(private _FormBuilder: FormBuilder, private _Renderer2: Renderer2, private _TimesheetService: TimesheetService, private _Router: Router) { }

  @ViewChild('mainDiv') mainDiv!: ElementRef
  nameAr: any = localStorage.getItem('employeeNameAR')
  nameEN: any = localStorage.getItem('employeeNameEN')
  empId: any = ''
  doneSent: boolean = false
  readonly: boolean = false
  noId: boolean = false
  todayDate: any = new Date().toISOString().split('T')[0]


  tiemSheet: FormGroup = this._FormBuilder.group({
    bigFormArray: this._FormBuilder.array([])
  })

  settingSheet: FormGroup = this._FormBuilder.group({
    rowNumbers: [15, Validators.max(30)],
    fixedDate: [false]
  })






  // =========== start customValidator
  startAndLeave(myform: FormGroup) {
    let start = myform.get('start')?.value
    let leave = myform.get('leave')?.value
    if (start >= leave && start && leave) {
      myform.get('leave')?.setErrors({ leaveSmaller: true })
    }
  }

  isAbssent(id: number) {
    let MyForm = this.bigFormArray.controls[id]
    let status = MyForm.get('absent')?.value;
    // اذا كان الموظف متغيب يتم ازالة التحقق من خانة الحضور و الانصراف
    if (status == true) {
      MyForm.get('leave')?.removeValidators(Validators.required)
      MyForm.get('start')?.removeValidators(Validators.required)
      MyForm.get('projectId')?.removeValidators(Validators.required)
      MyForm.get('leave')?.updateValueAndValidity()
      MyForm.get('start')?.updateValueAndValidity()
      MyForm.get('projectId')?.updateValueAndValidity()
      MyForm.patchValue({
        workingTimeByMinute: 0,
        start: null,
        leave: null,
        earlyByMinute: 0,
        lateByMinute: 0,
        projectId: 0
      })
      this.readonly = true
    }
    // اذا تم الغاء التفعيل من خانة الغياب يتم وضع التحقق علي خانة الحضور و الانصراف
    else {
      MyForm.get('leave')?.setValidators(Validators.required)
      MyForm.get('start')?.setValidators(Validators.required)
      MyForm.get('projectId')?.setValidators(Validators.required)
      MyForm.get('leave')?.updateValueAndValidity()
      MyForm.get('start')?.updateValueAndValidity()
      MyForm.get('projectId')?.updateValueAndValidity()
      this.readonly = false

    }
  }
  // =========== end customValidator








  get bigFormArray() {
    return this.tiemSheet.get('bigFormArray') as FormArray
  }


  ngOnInit(): void {
    this._TimesheetService.getBasicData().subscribe({
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
          this._Router.navigate(['login'])
        }
      }
    })
  }

  setSetting(number: any, fixedDate: any = null) {
    this.doneSent = false

    for (let i = 0; i < number; i++) {
      let newRow = this._FormBuilder.group({
        employeeId: [null, [Validators.required, Validators.minLength(4)]],
        employeeName: [null, Validators.required],



        date: [fixedDate, Validators.required],
        start: [null, Validators.required],
        leave: [null, Validators.required],
        earlyByMinute: [null],
        lateByMinute: [null],
        workingTimeByMinute: [null],
        projectId: [0, Validators.required],
        absent: [false],
      }, { validators: [this.startAndLeave] } as FormControlOptions)

      this.bigFormArray.push(newRow)

      this.serchId(newRow)

    }

    this.scrollDown()

    console.log(this.bigFormArray.value);

  }



  clearFormArray(): void {
    this.bigFormArray.clear();
  }




  prebData() {
    return {
      "employeeAttendances": this.bigFormArray.value
    }
  }





  sendData() {
    console.log(this.prebData());
    if (this.bigFormArray.valid) {
      this._TimesheetService.sendData(this.prebData()).subscribe({
        next: (Response) => {
          console.log(Response);
          if (Response == true) {
            this.showSuccessAlert()
            this.bigFormArray.clear()
            this.doneSent = true
          }
        },

        error: (err) => {
          console.log(err);
          this.showfailAlert()
        }
      })
    }
    else {
      this.bigFormArray.markAllAsTouched()
      console.log(this.bigFormArray.controls);
      this.showfailAlert()
    }
  }








  scrollDown() {
    let theDiv = this.mainDiv.nativeElement as HTMLElement
    setTimeout(() => { window.scrollTo(0, theDiv.offsetHeight) }, 0)
  }


  serchId(newRow: FormGroup) {
    newRow.get('employeeId')?.valueChanges
      // .pipe(debounceTime(300))  // تأخير التنفيذ بـ 300 مللي ثانية لتحسين الأداء
      .subscribe(value => {
        if (value) {
          let x = value! as string
          if (x.length == 4) {
            this.getNameByid(value, newRow);
          }
          else {
            newRow.get('employeeName')?.setValue(null)
            // this.noId = false
            // this.noData = false
          }
        }
      });

  }



  getNameByid(id: any, row: FormGroup) {

    row.get('employeeName')?.setValue(' ')// تعطيل ظهور خطأ الريكوايرد حتي معرفة صحة الاي دي

    this._TimesheetService.getNamebyId(id).subscribe({
      next: (Response) => {
        console.log(Response);
        row.get('employeeName')?.setValue(Response)
      },

      error: (err) => {
        row.get('employeeName')?.setValue(null)

        console.log(JSON.parse(err.error).message);
        if (err.error.message == 'Unauthorized') {
          localStorage.clear()
          this._Router.navigate(['login'])
        }
      }
    })
  }




  showSuccessAlert() {
    Swal.fire({
      icon: 'success',
      title: 'تم الإرسال بنجاح',
      showConfirmButton: true,
      confirmButtonText: 'موافق',
    });
  }
  showfailAlert() {
    Swal.fire({
      icon: 'warning',
      title: 'يجب ملئ الحقول بشكل صحيح',
      timer: 2000,
      showConfirmButton: true,
      confirmButtonText: 'موافق',
    });
  }




}

// شكل الداتا المطلوبة لأرسال التايم شيت في body json
// {
//   "employeeAttendances": [
//     {
//       "employeeId": "string",
//       "employeeName": "string",
//       "date": "2024-06-10",
//       "start": "string",
//       "leave": "string",
//       "earlyByMinute": 0,
//       "lateByMinute": 0,
//       "workingTimeByMinute": 0,
//       "projectId": 0,
//       "absent": true
//     }
//   ]
// }




