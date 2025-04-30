import { Component, Renderer2, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { EmpTimesheet } from 'src/app/shared/interfaces/emp-timesheet';
import { TimesheetService } from 'src/app/shared/services/timesheet.service';
import { Response } from './../../shared/interfaces/response';
import { Event, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { parse } from 'date-fns';


@Component({
  selector: 'app-display-timesheet',
  templateUrl: './display-timesheet.component.html',
  styleUrls: ['./display-timesheet.component.css']
})
export class DisplayTimesheetComponent implements OnInit {
  constructor(private _TimesheetService: TimesheetService, private _FormBuilder: FormBuilder, private _Renderer2: Renderer2, private _Router: Router) { }
  @ViewChild('mainDiv') mainDiv!: ElementRef
  noData: boolean = false
  noId: boolean = false
  empName: any = null
  empId: any = ''
  todayDate: any = new Date().toISOString().split('T')[0]
  allData: EmpTimesheet[] = [];



  settingSheet: FormGroup = this._FormBuilder.group({
    employeeId: [null, [Validators.required, Validators.minLength(4)]],
    projectId: [null],
    fromDate: [null, Validators.required],
    toDate: [this.todayDate, Validators.required]
  })

  // ======= start custom validations ======  
  // , { validators: this.idValidation } as FormControlOptions  
  // idValidation(myForm: FormGroup) {
  //   if (myForm.get('employeeId')?.value) {
  //     let value: string = myForm.get('employeeId')?.value
  //     if (value.length < 4) {
  // myForm.get('employeeId')?.setErrors({ idValidation: true })
  // }

  // }

  // }
  // ======= end custom validations ========       

  getData() {
    console.log(this.settingSheet.value);
    if (this.settingSheet.valid) {
      this._TimesheetService.getData(this.settingSheet.value).subscribe({
        next: (Response) => {
          console.log(Response);
          if (Response.employeeAttendances.length > 0) {
            this.allData = Response.employeeAttendances
            this.disableForm()
            this.noData = false
            this.scrollDown()
          }
          else {
            this.noData = true
          }


        },

        error: (err) => {
          console.log(err);
          this.EnableForm()
        },
      })
    }
    else {
      this.settingSheet.markAllAsTouched()
    }

  }

  newSearch(checkBox: HTMLInputElement) {
    this.EnableForm()
    this.settingSheet.reset()
    this.allData = []
    checkBox.checked = false
    this.empName = null
  }

  disableForm() {
    this.settingSheet.disable()
  }

  EnableForm() {
    this.settingSheet.enable()
  }

  ngOnInit(): void {
    // سبسكرايب علي انبوت الاي دي عشان اسحب تغيراته لما اليوزر يكتب فيه
    this.settingSheet.get('employeeId')?.valueChanges
      // .pipe(debounceTime(300))  // تأخير التنفيذ بـ 300 مللي ثانية لتحسين الأداء
      .subscribe(value => {
        if (value) {
          if (value.length == 4) {
            this.getNameByid(value);
          }
          else {
            this.empName = null
            this.noId = false
            this.noData = false
          }
        }
        else {
          this.empName = null
        }

      });
  }


  getNameByid(id: any) {
    this._TimesheetService.getNamebyId(id).subscribe({
      next: (Response) => {
        this.empName = Response
        console.log(this.empName , 'empppppaaaaaameeee');
        // this.settingSheet.get('empName')?.setValue(Response)
        this.noId = false

      },

      error: (err) => {
        this.empName = null
        this.noId = true
        console.log(JSON.parse(err.error).message);
        if (err.error.message == 'Unauthorized') {
          localStorage.clear()
          this._Router.navigate(['login'])
        }
      }
    })
  }


  markAllEmp(checked: any) {
    if (checked) {
      console.log(checked);
      this.settingSheet.get('employeeId')?.setValue(null)
      this.settingSheet.get('employeeId')?.clearValidators()
      this.settingSheet.get('employeeId')?.disable()
      this.settingSheet.get('employeeId')?.updateValueAndValidity()
      this.noId = false
      this.empName = "الجميع"

    }
    else if (!checked) {
      console.log(checked);

      this.settingSheet.get('employeeId')?.setValidators([Validators.required, Validators.minLength(4)])
      this.settingSheet.get('employeeId')?.updateValueAndValidity()
      this.settingSheet.get('employeeId')?.enable()
      this.empName = null


    }

  }


  scrollDown() {
    let theDiv = this.mainDiv.nativeElement as HTMLElement
    setTimeout(() => { window.scrollTo(0, theDiv.offsetHeight) }, 0)
  }




}
