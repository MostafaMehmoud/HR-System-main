import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { NewOrderService } from 'src/app/shared/services/new-order.service';

@Component({
  selector: 'app-letters',
  templateUrl: './letters.component.html',
  styleUrls: ['./letters.component.css']
})
export class LettersComponent {
  constructor(private _FormBuilder: FormBuilder, private _Renderer2: Renderer2, private _NewOrderService: NewOrderService , private _router:Router) { }

  @ViewChild('fileInpu') userFile!: ElementRef;
  @ViewChild('successModal') successModal!: ElementRef;
  @ViewChild('mainSection') mainSection!: ElementRef;
  todayDate: any = new Date().toISOString().split('T')[0]
  nameAr: any = localStorage.getItem('employeeNameAR')
  nameEN: any = localStorage.getItem('employeeNameEN')
  userToken: any = jwtDecode(localStorage.getItem('userToken')!)
  empId: any = this.userToken.empId


  lettersForm: FormGroup = this._FormBuilder.group({
    Recipient: [null, Validators.required], // الجهة المستلمة  
    certified: [null, Validators.required], // موثق من غرفة التجارة  
    letterType: [null, Validators.required], //   نوع الخطاب
    details: [null], // تفاصيل اخري
    myFile: [null],
  })

  ngOnInit(): void {
    setTimeout(() => { this._Renderer2.addClass(this.mainSection.nativeElement, 'slideIn') }, 0);
  }
  setFormData(): FormData {
    let myData: FormData = new FormData()
    myData.append('DestinationName', this.lettersForm.get('Recipient')?.value)
    myData.append('IsRequiredCCC', this.lettersForm.get('certified')?.value)
    myData.append('Details', this.lettersForm.get('details')?.value)
    myData.append('LetterType', this.lettersForm.get('letterType')?.value)

    // التأكد من وجود الملف وإرساله بشكل صحيح
    const fileInput = this.userFile.nativeElement;
    if (fileInput.files.length > 0) {
      myData.append('File', fileInput.files[0]);
    } else {
      console.log('No file selected');
    }
    return myData;
  }




  sendRequest() {
    if (this.lettersForm.valid) {
      this._NewOrderService.requestletter(this.setFormData()).subscribe({
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
      this.lettersForm.markAllAsTouched()
    }
  }

}
