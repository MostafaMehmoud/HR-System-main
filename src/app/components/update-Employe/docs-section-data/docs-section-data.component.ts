import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { empFullDetails } from 'src/app/shared/interfaces/dashboard';
import { modifiedEmployee } from 'src/app/shared/interfaces/update-data';
import { UpdateDataService } from 'src/app/shared/services/update-data.service';

@Component({
  selector: 'app-docs-section-data',
  templateUrl: './docs-section-data.component.html',
  styleUrls: ['./docs-section-data.component.css']
})
export class DocsSectionDataComponent {
  constructor(private _FormBuilder: FormBuilder, private _UpdateDataService: UpdateDataService, private _Router: Router,
    private _toaster: ToastrService, private _TranslateService: TranslateService, private _spinner: NgxSpinnerService) { }
  oneEmployee: empFullDetails = {} as empFullDetails
  enableEdit: boolean = false
  showData: boolean = false
  modifiedEmployee: modifiedEmployee = this._UpdateDataService.newEmpData;
  isFormChanged: boolean = false;
  mySubscription!: Subscription



  DocsFormData: FormGroup = this._FormBuilder.group({
    // معلومات الهوية الشخصية
    cardId: [null],
    cardDate: [null],
    cardPlace: [null],
    cardExpired: [null],

    // معلومات الجواز
    passportId: [null],
    passportDate: [null],
    passportPlace: [null],
    passportExpired: [null],

    // معلومات الصحة
    healthId: [null],
    healthDate: [null],
    healthExpired: [null],
    healthPlace: [null],
  })

  get currentLang() {
    return this._TranslateService.currentLang
  }

  ngOnInit(): void {
    this.getEmpData()
    this.monitorFormChanges()
    this.isCurrentSection()
  }



  isCurrentSection() {
    this.mySubscription = this._UpdateDataService.sendDataNow.subscribe(value => {
      if (value) {
        console.log('send docs-section data');
        this.sendUpdates()
      }
    })
  }

  ngOnDestroy(): void {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  monitorFormChanges() {
    this.DocsFormData.valueChanges.subscribe(() => {
      // تحقق إذا تم تعديل النموذج
      this.isFormChanged = this.DocsFormData.dirty; // dirty تتحقق مما إذا كان هناك أي تعديل
      this._UpdateDataService.isFormChanged.next(this.DocsFormData.dirty)

    });
  }

  getEmpData() {
    this._UpdateDataService.employeeData.subscribe(
      (value) => {
        console.log(value);
        this.oneEmployee = value
        this.DocsFormData.patchValue(this.oneEmployee)
        this.oneEmployee.cardDate && this.oneEmployee.cardDate.includes('0') ? this.oneEmployee.cardDate = new Date(this.oneEmployee.cardDate).toISOString().substring(0, 10) : ''
        this.oneEmployee.cardExpired && this.oneEmployee.cardExpired.includes('0') ? this.oneEmployee.cardExpired = new Date(this.oneEmployee.cardExpired).toISOString().substring(0, 10) : ''
        this.oneEmployee.passportDate && this.oneEmployee.passportDate.includes('0') ? this.oneEmployee.passportDate = new Date(this.oneEmployee.passportDate).toISOString().substring(0, 10) : ''
        this.oneEmployee.passportExpired && this.oneEmployee.passportExpired.includes('0') ? this.oneEmployee.passportExpired = new Date(this.oneEmployee.passportExpired).toISOString().substring(0, 10) : ''
        this.oneEmployee.healthDate && this.oneEmployee.healthDate.includes('0') ? this.oneEmployee.healthDate = new Date(this.oneEmployee.healthDate).toISOString().substring(0, 10) : ''
        this.oneEmployee.healthExpired && this.oneEmployee.healthExpired.includes('0') ? this.oneEmployee.healthExpired = new Date(this.oneEmployee.healthExpired).toISOString().substring(0, 10) : ''
        this._UpdateDataService.isFormChanged.next(false)

      }
    )

  }

  editSingleRow(element: any, target: any) {
    let x = this.DocsFormData.get(element)?.enable()

    const button = target as HTMLElement
    let updateButton = button.parentElement?.children[0] as HTMLElement
    let saveButton = button.parentElement?.children[1] as HTMLElement
    let cancelButton = button.parentElement?.children[2] as HTMLElement

    updateButton.style.display = 'none'
    saveButton.style.display = 'flex'
    cancelButton.style.display = 'flex'
  }

  closeEdittingInput(formCntrolName: any, target: any, originalValue: any, action: string) {
    let input = this.DocsFormData.get(formCntrolName)

    action == 'cancel' ? input?.setValue(originalValue) : ''

    input?.disable()
    // input?.value != originalValue ? this._Renderer2.addClass(input , 'is-valid') : '' مش هينفع عشان ده فورم كنترول وليس انبوت

    const button = target as HTMLElement
    let updateButton = button.parentElement?.children[0] as HTMLElement
    let saveButton = button.parentElement?.children[1] as HTMLElement
    let cancelButton = button.parentElement?.children[2] as HTMLElement
    updateButton.style.display = 'flex'
    saveButton.style.display = 'none'
    cancelButton.style.display = 'none'

  }

  equalizeData() {
    // نقوم بجلب الخصائص الموجودة في الـ partialObject فقط
    const updatedObject = Object.assign({}, ...Object.keys(this.modifiedEmployee)
      .filter(key => key in this.oneEmployee)
      .map(key => ({ [key]: this.oneEmployee[key as keyof empFullDetails] })));
    this.modifiedEmployee = updatedObject
  }

  setUpdates() {
    this.equalizeData()

    this.modifiedEmployee.cardId = this.ifValueSetString(this.DocsFormData.get('cardId')?.value)
    this.modifiedEmployee.cardDate = this.DocsFormData.get('cardDate')?.value
    this.modifiedEmployee.cardPlace = this.DocsFormData.get('cardPlace')?.value
    this.modifiedEmployee.cardExpired = this.DocsFormData.get('cardExpired')?.value
    this.modifiedEmployee.passportId = this.ifValueSetString(this.DocsFormData.get('passportId')?.value)
    this.modifiedEmployee.passportDate = this.DocsFormData.get('passportDate')?.value
    this.modifiedEmployee.passportPlace = this.DocsFormData.get('passportPlace')?.value
    this.modifiedEmployee.passportExpired = this.DocsFormData.get('passportExpired')?.value
    this.modifiedEmployee.healthId = this.ifValueSetString(this.DocsFormData.get('healthId')?.value)
    this.modifiedEmployee.healthDate = this.DocsFormData.get('healthDate')?.value
    this.modifiedEmployee.healthExpired = this.DocsFormData.get('healthExpired')?.value
    this.modifiedEmployee.healthPlace = this.DocsFormData.get('healthPlace')?.value
  }

  sendUpdates() {
    this.setUpdates()
    console.log(this.modifiedEmployee);
    this._spinner.show("spinner2")
    this._UpdateDataService.AddOrUpdateEmployee(this.modifiedEmployee).subscribe({
      next: (res) => {
        if (res.isSuccess == true) {
          this.getEmployeeDetails(this.modifiedEmployee.employeeId)
          this._toaster.success('تم تحديث بيانات الموظف بنجاح', "تم التعديل", { positionClass: 'toast-bottom-right' })
         
        }
        else {
          this._toaster.error('لم يتم تحديث بيانات الموظف .. حاول لاحقاً', "فشل التعديل", { positionClass: 'toast-bottom-right' })
        }
        this._spinner.hide("spinner2")
        console.log(res)
      },
      error: (err) => {
        this._toaster.error('لم يتم تحديث بيانات الموظف .. حاول لاحقاً ', "فشل التعديل", { positionClass: 'toast-bottom-right' })
        console.log(err)
        this._spinner.hide("spinner2")
      }
    })
  }


  ifValueSetString(value: any) {
    if (value) {
      return String(value)
    }
    else {
      return value
    }
  }


  getEmployeeDetails(empID: string) {
    this._UpdateDataService.getEmpFullData(empID).subscribe({
      next: (data) => {
        console.log(data , 'dataaaa from docssss');
        
        this._UpdateDataService.employeeData.next(data)
        this._UpdateDataService.isFormChanged.next(this.DocsFormData.dirty)
        this.oneEmployee.cardDate && this.oneEmployee.cardDate.includes('0') ? this.oneEmployee.cardDate = new Date(this.oneEmployee.cardDate).toISOString().substring(0, 10) : ''
        this.oneEmployee.cardExpired && this.oneEmployee.cardExpired.includes('0') ? this.oneEmployee.cardExpired = new Date(this.oneEmployee.cardExpired).toISOString().substring(0, 10) : ''
        this.oneEmployee.passportDate && this.oneEmployee.passportDate.includes('0') ? this.oneEmployee.passportDate = new Date(this.oneEmployee.passportDate).toISOString().substring(0, 10) : ''
        this.oneEmployee.passportExpired && this.oneEmployee.passportExpired.includes('0') ? this.oneEmployee.passportExpired = new Date(this.oneEmployee.passportExpired).toISOString().substring(0, 10) : ''
        this.oneEmployee.healthDate && this.oneEmployee.healthDate.includes('0') ? this.oneEmployee.healthDate = new Date(this.oneEmployee.healthDate).toISOString().substring(0, 10) : ''
        this.oneEmployee.healthExpired && this.oneEmployee.healthExpired.includes('0') ? this.oneEmployee.healthExpired = new Date(this.oneEmployee.healthExpired).toISOString().substring(0, 10) : ''
        this._UpdateDataService.isFormChanged.next(false)

      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
