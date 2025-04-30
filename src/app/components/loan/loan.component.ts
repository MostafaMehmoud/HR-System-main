import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { LoanService } from 'src/app/shared/services/loan.service';
import { Response } from './../../shared/interfaces/response';
import { FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
  constructor(private _LoanService: LoanService, private _FormBuilder: FormBuilder, private _router: Router ,private _TranslateService:TranslateService) { }
  todayDate: any = new Date().toISOString().split('T')[0]
  
  // الفورم الخاص بملئ بيانات السلفة
  loanForm: FormGroup = this._FormBuilder.group({
    advancePaymentValue: [null, Validators.required], // قيمة السلفة
    installmentValue: [null, Validators.required], // قيمة القسط
    lastInstallmentValue: [{ value: null, disabled: true }, Validators.required], // القسط الاخير
    numberOfInstallment: [{ value: null, disabled: true }, Validators.required],// عدد الاقساط
    startDate: [null, Validators.required]// تاريخ البدء
  }, { validators: [this.Install] } as FormControlOptions)

  pageOpenOne: boolean = false
  NameAR: any = ''
  NameEN: any = ''
  empId: any = ''
  raseed: number = 0
  requestSent: boolean = false


  // استنتاج عدد الاقساط من المبلغ
  calcNumberOfInstalls() {
    let loan = this.loanForm.get('advancePaymentValue') // مبلغ السلفة
    let install = this.loanForm.get('installmentValue') // القسط الواحد
    let numOfInstall = this.loanForm.get('numberOfInstallment') // عدد الاقساط
    let lastInstall = this.loanForm.get('lastInstallmentValue') // عدد الاقساط

    let newNum = Number(loan?.value) / Number(install?.value)// المبلغ علي القسط يعطينا عدد الاقساط
    let fixedNum = Math.floor(newNum)// عدد الاقساط بالتقريب الي رقم اقل
    let addition = newNum - fixedNum // الكسور المستخرجة من التقريب

    //   القسط الاخير = القسط + القسط مضروب في فارق التقريب  
    let newLastInstall = Number(install?.value) + (addition * Number(install?.value))

    if (install?.value != null && install.errors == null) {
      numOfInstall?.setValue(fixedNum)
      lastInstall?.setValue(Math.round(newLastInstall))
    }
    else {
      numOfInstall?.setValue(null)
      lastInstall?.setValue(null)
    }

  }
  // استنتاج قيمة القسط من العدد
  // calcInstallFromNumber() {
  //   let loan = this.loanForm.get('advancePaymentValue')
  //   let install = this.loanForm.get('installmentValue')
  //   let numOfInstall = this.loanForm.get('numberOfInstallment')
  //   let newInstall = Number(loan?.value) / Number(numOfInstall?.value)

  //   if (loan?.value != null) {
  //     install?.setValue(newInstall)
  //   }
  // }

  // ازالة اي ارقام من خانة القسط عند التعديل في مبلغ السلفة
  cleanInstall(): void {
    this.loanForm.get('installmentValue')?.setValue('')
    this.loanForm.get('lastInstallmentValue')?.setValue(null)
    this.loanForm.get('numberOfInstallment')?.setValue(null)
  }

  Install(myForm: FormGroup) {
    let install = myForm.get('installmentValue')
    let loan = myForm.get('advancePaymentValue')
    let numOfInstall = myForm.get('numberOfInstallment')


    if (install?.value < 100) {
      install?.setErrors({ minAmount: true })
    }

    else if (Number(install?.value) > Number(loan?.value)) {
      install?.setErrors({ moreThan: true })
    }

  }

  sendRequest() {
    // data dosent come auto because the  disabled
    if (localStorage.getItem('userToken') == (null || undefined)) {
      this._router.navigate(['login'])
    }
    this.loanForm.value.lastInstallmentValue = this.loanForm.get('lastInstallmentValue')?.value
    this.loanForm.value.numberOfInstallment = this.loanForm.get('numberOfInstallment')?.value
    console.log(this.loanForm.value);
    console.log(this.loanForm.valid);


    if (this.loanForm.valid) {

      this._LoanService.requestLoan(this.loanForm.value).subscribe({
        next: (Response) => {
          if (Response == true) {
            console.log(Response);
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
      this.loanForm.markAllAsTouched()
    }
  }

  ngOnInit(): void {

    setTimeout(() => {this.pageOpenOne = true}, 100);


    if (localStorage.getItem('userToken') == (null || undefined)) {
      this._router.navigate(['login'])
    }
    this._LoanService.basicLoanData().subscribe({
      next: (Response) => {
        this.NameAR = Response.nameAr
        this.NameEN = Response.nameEn
        this.empId = Response.empId
        this.raseed = Response.loansbal
        console.log(Response);
        console.log(this.todayDate);
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
