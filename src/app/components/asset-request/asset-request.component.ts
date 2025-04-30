import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { NewOrderService } from 'src/app/shared/services/new-order.service';

@Component({
  selector: 'app-asset-request',
  templateUrl: './asset-request.component.html',
  styleUrls: ['./asset-request.component.css']
})
export class AssetRequestComponent {
  constructor(private _FormBuilder: FormBuilder, private _Renderer2: Renderer2, private _NewOrderService: NewOrderService, private _router: Router) { }

  @ViewChild('fileInpu') userFile!: ElementRef;
  @ViewChild('successModal') successModal!: ElementRef;
  @ViewChild('mainSection') mainSection!: ElementRef;
  todayDate: any = new Date().toISOString().split('T')[0]
  nameAr: any = localStorage.getItem('employeeNameAR')
  nameEN: any = localStorage.getItem('employeeNameEN')
  userToken: any = jwtDecode(localStorage.getItem('userToken')!)
  empId: any = this.userToken.empId


  AssetForm: FormGroup = this._FormBuilder.group({
    AssetName: [null, Validators.required], //  بداية الاجازة
    saveAsset: [null, Validators.requiredTrue], // مدة الاجازة 
    myFile: [null],
  })

  ngOnInit(): void {
    setTimeout(() => { this._Renderer2.addClass(this.mainSection.nativeElement, 'slideIn') }, 0);
  }


  setFormData(): FormData {
    let myData: FormData = new FormData()
    myData.append('Details', this.AssetForm.get('AssetName')?.value)
    myData.append('IsEmployeeAgree', this.AssetForm.get('saveAsset')?.value)

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
    console.log(this.AssetForm.invalid);

    if (this.AssetForm.valid) {
      this._NewOrderService.requestasset(this.setFormData()).subscribe({

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
      this.AssetForm.markAllAsTouched()
    }
  }


}
