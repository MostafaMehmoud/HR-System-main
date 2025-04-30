import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { addedEmployeeInterface } from 'src/app/shared/interfaces/update-data';
import { UpdateDataService } from 'src/app/shared/services/update-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  constructor(private _FormBuilder: FormBuilder, private _UpdateDataService: UpdateDataService, private _Router: Router,
     private _Renderer2: Renderer2 , private _TranslateService: TranslateService , private _router: Router) { }

  unKnownErr: boolean = false
  UnstoredRequest: boolean = false
  creationDone: boolean = false
  newEmpData: addedEmployeeInterface = {} as addedEmployeeInterface
  get currentLang() {
    return this._TranslateService.currentLang
  }



  employeeDataForm: FormGroup = this._FormBuilder.group({
    employeeNameAr: [null, Validators.required],
    employeeNameEn: [null, Validators.required]
  })


  sendData() {
    if (this.employeeDataForm.valid) {
      this.createNewEmp(this.employeeDataForm.value)
      this.newEmpData = this.employeeDataForm.value
    }
    else {
      this.employeeDataForm.markAllAsTouched()
    }
  }


  createNewEmp(body: any) {
    console.log(body);
    this._UpdateDataService.AddOrUpdateEmployee(body).subscribe({
      next: (res) => {
        console.log(res)
        if (res.isSuccess == true) {
          console.log('create new emp succesfully');
          localStorage.setItem('createdEmpID', res.employeeId)
          this.newEmpData.employeeId = res.employeeId
          this.creationDone = true
          this.unKnownErr = false
          this.UnstoredRequest = false
          this.employeeDataForm.get('employeeNameAr')?.disable()
          this.employeeDataForm.get('employeeNameEn')?.disable()
          this.succsesAlert()
        }
        else {
          this.UnstoredRequest = true
        }
      },

      error: (err) => {
        this.unKnownErr = true
        console.log(err)
      }
    })
  }


  succsesAlert() {
    Swal.fire({
      title: this.currentLang == 'ar' ? 'تم تسجيل الموظف بنجاح ' : 'request has been sent successfully',
      text: this.currentLang == 'ar' ? 'يمكنك الان استكمال تسجيل البيانات الاخرى' : 'now you can add more details to this employee',
      icon: 'success',
      confirmButtonColor: '#02c49a',
      confirmButtonText: this.currentLang == 'ar' ? 'موافق' : 'OK',
      focusConfirm : false
    })
  }

  goToUpdatePage(){
    this._router.navigate(['/employee-update'])
  }
}
