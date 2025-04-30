import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { LoanService } from 'src/app/shared/services/loan.service';
import { Response } from './../../shared/interfaces/response';
import { FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { VacationService } from 'src/app/shared/services/vacation.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-vacation',
  templateUrl: './vacation.component.html',
  styleUrls: ['./vacation.component.css']
})
export class VacationComponent implements OnInit {
  constructor(private _VacationService: VacationService, private _FormBuilder: FormBuilder, private _router: Router) { }

  @ViewChild('fileInput') userFile!: ElementRef;

  pageOpenOne: boolean = false
  nameAr: any = localStorage.getItem('employeeNameAR')
  nameEN: any = localStorage.getItem('employeeNameEN')
  empId: any = ''
  availableDays: number = 0
  takenDays: number = 0
  requestSent: boolean = false
  errorMaximumDays: boolean = false
  todayDate: any = new Date().toISOString().split('T')[0]


  vacationForm: FormGroup = this._FormBuilder.group({
    startDate: [null, Validators.required], //  بداية الاجازة
    numberOfDays: [null, Validators.required], // مدة الاجازة 
    Details: [null], // تفاصيل اخري
    vacationType: [null, Validators.required],// نوع الاجازة 
    myFile: [null],// نوع الاجازة 
  })

  setFormData(): FormData {
    let myData: FormData = new FormData()
    myData.append('StartDate', this.vacationForm.get('startDate')?.value)
    myData.append('NumberOfDays', this.vacationForm.get('numberOfDays')?.value)
    myData.append('Details', this.vacationForm.get('Details')?.value)
    myData.append('VacationType', this.vacationForm.get('vacationType')?.value)
    // التأكد من وجود الملف وإرساله بشكل صحيح
    const fileInput = this.userFile.nativeElement;
    if (fileInput.files.length > 0) {
      myData.append('File', fileInput.files[0]);
      console.log(fileInput.files[0]);

    } else {
      console.log('No file selected');
    }
    return myData;
  }


  sendRequest() {
    console.log(this.vacationForm.valid, 'valid');
    if (this.vacationForm.get('numberOfDays')?.value <= this.availableDays && this.vacationForm.valid) {
      this._VacationService.requestvacation(this.setFormData()).subscribe({
        next: (Response) => {
          console.log(Response);
          if (Response == true) {
            this.requestSent = true
          }

        },

        error: (err) => {
          console.log(err);
          if (err.error.message == 'Unauthorized') {
            localStorage.clear()
            this._router.navigate(['login'])
          }
          this.requestSent = false
        }
      })

    }
    else {
      this.vacationForm.markAllAsTouched()
    }
  }

  ngOnInit(): void {
    setTimeout(() => { this.pageOpenOne = true }, 0);
    this._VacationService.basicvacationData().subscribe({
      next: (Response) => {
        this.nameAr = Response.nameAr
        this.nameEN = Response.nameEn
        this.empId = Response.empId
        this.availableDays = Response.availableDays
        this.takenDays = Response.takenDays
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

}
