import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Response } from 'src/app/shared/interfaces/response';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private _FormBuilder: FormBuilder, private _AuthService: AuthService, private _Router: Router , private _TranslateService: TranslateService) { }

  loginForm: FormGroup = this._FormBuilder.group({
    Username: [null, Validators.required],
    Password: [null, Validators.required]
  })

  wrongMsg: boolean = false
  isloading: boolean = false
  myresponse: Response = {} as Response





  setFormData(): FormData {
    let myNewBody: FormData = new FormData()
    myNewBody.append('Username', this.loginForm.get('Username')?.value)
    myNewBody.append('Password', this.loginForm.get('Password')?.value)
    return myNewBody
  }

  setLoging() {
    this.isloading = true
    this._AuthService.login(this.setFormData()).subscribe({
      next: (response) => {
        this.isloading = false
        this.myresponse = response
        localStorage.setItem('userToken', this.myresponse.accessToken )
        localStorage.setItem('employeeNameAR', this.myresponse.employeeInfo.nameAr )
        localStorage.setItem('employeeNameEN', this.myresponse.employeeInfo.nameEn )
        if (response.employeeInfo.isAdmin == false) {
          this._Router.navigate(['home'])
        }
        else if (response.employeeInfo.isAdmin == true){
          localStorage.setItem('userRole', 'an_tripple_of_h3b5y5tyb2FX' )
          this._Router.navigate(['admin-home'])
        }
      },
      
      error: (err) => {
        console.log(err);
        this.wrongMsg = true
        this.isloading = false
      }
    })
  }

  hideErrMsg() {
    this.wrongMsg = false
  }
}
