import { Component, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { branch, empFullDetails } from 'src/app/shared/interfaces/dashboard';
import { UpdateDataService } from 'src/app/shared/services/update-data.service';
import { modifiedEmployee } from './../../../shared/interfaces/update-data';
import { oneEmployee } from 'src/app/shared/interfaces/update-data';
import { debounceTime, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-main-section-data',
  templateUrl: './main-section-data.component.html',
  styleUrls: ['./main-section-data.component.css']
})
export class MainSectionDataComponent {
  constructor(private _FormBuilder: FormBuilder, private _UpdateDataService: UpdateDataService,
    private _Router: Router, private _toaster: ToastrService, private _TranslateService: TranslateService, private _spinner: NgxSpinnerService) { }
  oneEmployee: empFullDetails = {} as empFullDetails
  itemsList: any[] = []
  enableEdit: boolean = false
  showData: boolean = false
  modifiedEmployee: modifiedEmployee = this._UpdateDataService.newEmpData;
  originalAllGroups: branch[] = []
  allgroups: branch[] = []
  enableEditName: string = ''
  branchChosen: boolean = true
  isFormChanged: boolean = false;
  inValidMsg: boolean = false
  todayDate: any = new Date().toISOString().split('T')[0]
  mySubscription!: Subscription
  sendingData: boolean = false

  mainEmployeeData: FormGroup = this._FormBuilder.group({
    employeeNameAr: [null],
    employeeNameEn: [null],
    employeeId: [{ value: null, disabled: true }],
    employeePersonId: [null],
    employeePersonExpireDate: [null],
    birthDate: [null],
    birthPlace: [null],
    // age: [null, [Validators.max(80) ,Validators.min(18)]],
    age: [{ value: null, disabled: true }],
    motherName: [null],
    gender: [null],
    marrige: [null],

    // معلومات الكفيل
    kafilId: [{ value: null, disabled: true }, Validators.required],
    kafilNameAr: [null],
    kafilNameEn: [null],

    // معلومات الشركة
    companyId: [{ value: null, disabled: true }, Validators.required],
    companyNameAr: [null],
    companyNameEn: [null],
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
        console.log('send main-section date');
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
    this.mainEmployeeData.valueChanges.subscribe(() => {
      // تحقق إذا تم تعديل النموذج
      this.isFormChanged = this.mainEmployeeData.dirty; // dirty تتحقق مما إذا كان هناك أي تعديل
      this._UpdateDataService.isFormChanged.next(this.mainEmployeeData.dirty)

    });
  }

  equalizeData() {
    // نقوم بجلب الخصائص الموجودة في الـ partialObject فقط
    const updatedObject = Object.assign({}, ...Object.keys(this.modifiedEmployee)
      .filter(key => key in this.oneEmployee)
      .map(key => ({ [key]: this.oneEmployee[key as keyof empFullDetails] })));
    this.modifiedEmployee = updatedObject
  }

  getEmpData() {
    this._UpdateDataService.employeeData.subscribe(
      (value) => {
        console.log(value);
        this.oneEmployee = value
        this.mainEmployeeData.patchValue(this.oneEmployee)

        this.oneEmployee.birthDate ? this.oneEmployee.birthDate = new Date(this.oneEmployee.birthDate).toISOString().substring(0, 10) : ''
        this.oneEmployee.employeePersonExpireDate ? this.oneEmployee.employeePersonExpireDate = new Date(this.oneEmployee.employeePersonExpireDate).toISOString().substring(0, 10) : ''
        this.oneEmployee.birthDate ? this.calculateAge() : ''
        this._UpdateDataService.isFormChanged.next(false)

      }
    )

  }

  CalcAgeDirectly() {
    // this func is using for change age directly when user change birthDate after leaving the input
    let editedDate = this.mainEmployeeData.get("birthDate")?.value
    if (editedDate) {
      const birthDate = new Date(editedDate);
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.mainEmployeeData.get('age')?.setValue(age)
    }
  }

  calculateAge(): void {
    // تحويل تاريخ الميلاد إلى كائن Date
    const birthDate = new Date(this.oneEmployee.birthDate);
    // تاريخ اليوم الحالي
    const today = new Date();
    // حساب العمر بالسنوات
    let age = today.getFullYear() - birthDate.getFullYear();

    // التحقق من ما إذا كان عيد ميلاده لم يأتي بعد هذه السنة
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.oneEmployee.age = `${age}`
  }


  // =========================== start ===========================
  // تعديل احد الخانات الاختيارية مثل الشركة او الفرع .. الخ
  getAllGroubOf(key: string, control: string, controlID: string) {
    this.enableEditName = control
    this.allgroups = []
    this._UpdateDataService.getAllGroubOf(key).subscribe({
      next: (response) => {
        this.allgroups = response
        this.allgroups = this.allgroups.sort((a, b) => Number(a.id) - Number(b.id))
        this.originalAllGroups = this.allgroups
        this.groubSearching(control, controlID)
        // بديله اسم الخانة اللي بيتم التعديل عليها و دي اللي هيظهر الليست تحتها
      }
    })
  }

  groubSearching(control: string, controlID: string) {
    this.mainEmployeeData.get(control)?.valueChanges
      .pipe(debounceTime(300)).subscribe(value => {
        // تأخير التنفيذ بـ 300 مللي ثانية لتحسين الأداء
        if (!value) {
          this.mainEmployeeData.get(controlID)?.disable()
          this.mainEmployeeData.get(control)?.setValue(null, { emitEvent: false })
          this.searchByName('')
          this.inValidMsg = false
        }
        else {
          this.searchByName(value)
        }
      });
  }

  searchByName(value: string) {
    this.allgroups = this.originalAllGroups.filter((item) => { return ((item.nameAr ? (item.nameAr).includes(value) : '') || (item.nameEn ? (item.nameEn).toLocaleLowerCase().includes(value.toLocaleLowerCase()) : '') || item.id.includes(value)) })
  }

  setChosenValue(item: branch, ControlNameAr: string, ControlNameEn: string, ControlID: string) {
    this.mainEmployeeData.get(ControlNameAr)?.setValue(item.nameAr);
    this.mainEmployeeData.get(ControlNameEn)?.setValue(item.nameEn);
    this.mainEmployeeData.get(ControlID)?.setValue(item.id);
    this.mainEmployeeData.markAsDirty()
    this.mainEmployeeData.get(ControlID)?.disable();
    this.enableEditName = ''
    this.inValidMsg = false

  }


  // تعديل احد الخانات الاختيارية مثل الشركة او الفرع .. الخ
  // =========================== end ===========================

  setUpdates() {
    this.equalizeData()
    this.modifiedEmployee.employeeNameAr = this.mainEmployeeData.get('employeeNameAr')?.value
    this.modifiedEmployee.employeeNameEn = this.mainEmployeeData.get('employeeNameEn')?.value
    this.modifiedEmployee.employeeId = this.mainEmployeeData.get('employeeId')?.value
    this.modifiedEmployee.employeePersonId = this.ifValueSetString(this.mainEmployeeData.get('employeePersonId')?.value)
    this.modifiedEmployee.employeePersonExpireDate = this.mainEmployeeData.get('employeePersonExpireDate')?.value
    this.modifiedEmployee.birthDate = this.mainEmployeeData.get('birthDate')?.value
    this.modifiedEmployee.birthPlace = this.mainEmployeeData.get('birthPlace')?.value
    this.modifiedEmployee.motherName = this.mainEmployeeData.get('motherName')?.value
    this.modifiedEmployee.gender = this.mainEmployeeData.get('gender')?.value
    this.modifiedEmployee.marrige = this.mainEmployeeData.get('marrige')?.value
    this.modifiedEmployee.kafilId = this.mainEmployeeData.get('kafilId')?.value
    this.modifiedEmployee.companyId = this.mainEmployeeData.get('companyId')?.value
  }

  sendUpdates() {
    this.setUpdates()
    console.log(this.modifiedEmployee);
    console.log(this.mainEmployeeData.valid, 'is it valid?');
    if (this.mainEmployeeData.valid) {
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
    else {
      this.inValidMsg = true
    }
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
        this._UpdateDataService.employeeData.next(data)
        this.isFormChanged = false
        this._UpdateDataService.isFormChanged.next(false)

      },
      error: (err) => {
        console.log(err);
      }
    })
  }



  hideList() {
    this.enableEditName = ''
  }


  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest('.my-options-list, input');
    if (!clickedInside) {
      this.hideList(); // إخفاء القائمة فقط إذا كان النقر خارج العنصر
    }
  }


  makeItInvalid(ControlID: string) {
    // if user typing at name ar or name en >> we make id invalid .. why ?
    // to stop submitting form because it will be invalid
    this.mainEmployeeData.get(ControlID)?.enable();
    this.mainEmployeeData.get(ControlID)?.setValue(null);
    console.log('invalid');
  }

}

