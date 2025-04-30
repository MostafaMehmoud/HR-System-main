import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { VacationService } from 'src/app/shared/services/vacation.service';
import { Response, Permission } from 'src/app/shared/interfaces/response';
import { NewOrderService } from 'src/app/shared/services/new-order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave-permission',
  templateUrl: './leave-permission.component.html',
  styleUrls: ['./leave-permission.component.css']
})
export class LeavePermissionComponent implements OnInit {
  constructor(private _FormBuilder: FormBuilder, private _Renderer2: Renderer2, private _NewOrderService: NewOrderService, private _router: Router) { }

  @ViewChild('fileInpu') userFile!: ElementRef;
  @ViewChild('successModal') successModal!: ElementRef;
  @ViewChild('mainSection') mainSection!: ElementRef;
  todayDate: any = new Date().toISOString().split('T')[0]
  nameAr: any = localStorage.getItem('employeeNameAR')
  nameEN: any = localStorage.getItem('employeeNameEN')
  userToken: any = jwtDecode(localStorage.getItem('userToken')!)
  empId: any = this.userToken.empId


  permissionForm: FormGroup = this._FormBuilder.group({
    startingTime: ["08:00", Validators.required], //  بداية الاجازة
    endTime: [null, Validators.required], //  بداية الاجازة
    details: [null], // تفاصيل اخري
    PerDate: [this.todayDate],
    myFile: [null],
  }, { validators: [this.startAndEnd], } as FormControlOptions)




  ngOnInit(): void {
    console.log(new Date().toISOString());

    setTimeout(() => { this._Renderer2.addClass(this.mainSection.nativeElement, 'slideIn') }, 0);
  }


  setFormData(): FormData {
    let myData: FormData = new FormData()
    myData.append('StartDate',this.permissionForm.get('PerDate')?.value +'T'+ this.permissionForm.get('startingTime')?.value)
    myData.append('EndDate', this.permissionForm.get('PerDate')?.value +'T'+ this.permissionForm.get('endTime')?.value)
    myData.append('Details', this.permissionForm.get('details')?.value)

    // التأكد من وجود الملف وإرساله بشكل صحيح
    const fileInput = this.userFile.nativeElement;
    if (fileInput.files.length > 0) {
      myData.append('File', fileInput.files[0]);
    } else {
      console.log('No file selected');
    }
    return myData;
  }

  // custom validator for timing
  startAndEnd(myForm: FormGroup) {
    let start = myForm.get('startingTime')
    let end = myForm.get('endTime')
    if (start?.value >= end?.value) {
      myForm.get('endTime')?.setErrors({ 'startandend': true })
    }
  }


  sendRequest() {
    if (this.permissionForm.valid) {
      console.log('valid');
      this._NewOrderService.requestpermission(this.setFormData()).subscribe({
        next: (Response) => {
          if (Response == true) {
            this._Renderer2.removeClass(this.successModal.nativeElement, 'd-none')
            this._Renderer2.addClass(this.mainSection.nativeElement, 'd-none')
          }

        },

        error: (err) => {
          console.log(err)
          if (err.error.message == 'Unauthorized') {
            localStorage.clear()
            this._router.navigate(['login'])
          }
        }
      })
    }


    else {
      this.permissionForm.markAllAsTouched()
    }

  }





}
