import { Component, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subscription } from 'rxjs';
import { branch, empFullDetails } from 'src/app/shared/interfaces/dashboard';
import { modifiedEmployee } from 'src/app/shared/interfaces/update-data';
import { UpdateDataService } from 'src/app/shared/services/update-data.service';

@Component({
  selector: 'app-managment-section-data',
  templateUrl: './managment-section-data.component.html',
  styleUrls: ['./managment-section-data.component.css']
})
export class ManagmentSectionDataComponent {
  constructor(private _FormBuilder: FormBuilder, private _UpdateDataService: UpdateDataService, private _spinner: NgxSpinnerService,
    private _Router: Router, private _toaster: ToastrService, private _TranslateService: TranslateService) { }
  oneEmployee: empFullDetails = {} as empFullDetails
  itemsList: any[] = []
  enableEdit: boolean = false
  showData: boolean = false
  modifiedEmployee: modifiedEmployee = this._UpdateDataService.newEmpData;
  originalAllGroups: branch[] = []
  allgroups: branch[] = []
  enableEditName: string = ''
  isFormChanged: boolean = false;
  categoryList: branch[] = []
  inValidMsg: boolean = false
  mySubscription!: Subscription

  ManagementFormData: FormGroup = this._FormBuilder.group({
    // معلومات الفروع والإدارة
    branchId: [{ value: null, disabled: true }, Validators.required],
    branchNameAr: [null],
    branchNameEn: [null],
    jobId: [{ value: null, disabled: true }, Validators.required],
    jobNameAr: [null],
    jobNameEn: [null],
    manageId: [{ value: null, disabled: true }, Validators.required],
    manageNameAr: [null],
    manageNameEn: [null],
    departmentId: [{ value: null, disabled: true }, Validators.required],
    departmentNameAr: [null],
    departmentNameEn: [null],
    employeeCategoryId: [{ value: null, disabled: true }, Validators.required],
    employeeCategoryNameAr: [null],
    employeeCategoryNameEn: [null],
  })

  get currentLang() {
    return this._TranslateService.currentLang
  }

  ngOnInit(): void {
    this.getEmpData()
    this.monitorFormChanges()
    this.getAllCategory()
    this.isCurrentSection()
  }


  isCurrentSection() {
    this.mySubscription = this._UpdateDataService.sendDataNow.subscribe(value => {
      if (value) {
        console.log('send management-section data');
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
    this.ManagementFormData.valueChanges.subscribe(() => {
      // تحقق إذا تم تعديل النموذج
      this.isFormChanged = this.ManagementFormData.dirty; // dirty تتحقق مما إذا كان هناك أي تعديل
      this._UpdateDataService.isFormChanged.next(this.ManagementFormData.dirty)

    });
  }

  getEmpData() {
    this._UpdateDataService.employeeData.subscribe(
      (value) => {
        console.log(value);
        this.oneEmployee = value
        this.ManagementFormData.patchValue(this.oneEmployee)
        this._UpdateDataService.isFormChanged.next(false)

      }
    )

  }


  editSingleRow(element: any, target: any) {
    let x = this.ManagementFormData.get(element)?.enable()

    const button = target as HTMLElement
    let updateButton = button.parentElement?.children[0] as HTMLElement
    let saveButton = button.parentElement?.children[1] as HTMLElement
    let cancelButton = button.parentElement?.children[2] as HTMLElement

    updateButton.style.display = 'none'
    saveButton.style.display = 'flex'
    cancelButton.style.display = 'flex'
  }

  closeEdittingInput(formCntrolName: any, target: any, originalValue: any, action: string) {
    let input = this.ManagementFormData.get(formCntrolName)

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

    this.enableEditName = ''
  }




  equalizeData() {
    // نقوم بجلب الخصائص الموجودة في الـ partialObject فقط
    const updatedObject = Object.assign({}, ...Object.keys(this.modifiedEmployee)
      .filter(key => key in this.oneEmployee)
      .map(key => ({ [key]: this.oneEmployee[key as keyof empFullDetails] })));
    this.modifiedEmployee = updatedObject
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
    this.ManagementFormData.get(control)?.valueChanges
      .pipe(debounceTime(300)).subscribe(value => {
        // تأخير التنفيذ بـ 300 مللي ثانية لتحسين الأداء
        if (!value) {
          this.ManagementFormData.get(controlID)?.disable()
          this.ManagementFormData.get(control)?.setValue(null, { emitEvent: false })
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

  setChosenValue(item: branch, ControlNameAr: string, ControlNameEn: string, ControlID: string, thisControl: string) {
    this.ManagementFormData.get(ControlNameAr)?.setValue(item.nameAr);
    this.ManagementFormData.get(ControlNameEn)?.setValue(item.nameEn);
    this.ManagementFormData.get(ControlID)?.setValue(item.id);
    this.ManagementFormData.markAsDirty()
    this.ManagementFormData.get(ControlID)?.disable();
    this.enableEditName = ''
    this.inValidMsg = false

    // this.closeEdittingInput(thisControl, target, '', 'save')

    console.log(item);

  }


  // تعديل احد الخانات الاختيارية مثل الشركة او الفرع .. الخ
  // =========================== end ===========================

  setUpdates() {
    this.equalizeData()
    this.modifiedEmployee.branchId = this.ManagementFormData.get('branchId')?.value
    this.modifiedEmployee.jobId = this.ManagementFormData.get('jobId')?.value
    this.modifiedEmployee.manageId = this.ManagementFormData.get('manageId')?.value
    this.modifiedEmployee.departmentId = this.ManagementFormData.get('departmentId')?.value
    this.modifiedEmployee.employeeCategoryId = this.ManagementFormData.get('employeeCategoryId')?.value
  }

  sendUpdates() {
    this.setUpdates()
    console.log(this.modifiedEmployee);
    console.log(this.ManagementFormData.valid, 'is it valid?');
    if (this.ManagementFormData.valid) {
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
    this.ManagementFormData.get(ControlID)?.enable();
    this.ManagementFormData.get(ControlID)?.setValue(null);
    // this.getAllGroubOf('job' , 'jobNameAr' , 'jobId')
    console.log('invalid');
  }


  getAllCategory() {
    this._UpdateDataService.getAllGroubOf('EmployeeCategory').subscribe({
      next: (data) => {
        this.categoryList = data
        this.categoryList = this.categoryList.sort((a, b) => Number(a.id) - Number(b.id))
        console.log(data);
      },
      error: (err) => {
        console.log(err);

      }
    })
  }

  setCategory(controlName: string) {
    let categoryName: string = this.ManagementFormData.get(controlName)?.value
    let myCategory = this.categoryList.filter((item) => { return item.nameAr == categoryName || item.nameEn == categoryName })

    this.ManagementFormData.get('employeeCategoryNameAr')?.setValue(myCategory[0].nameAr)
    this.ManagementFormData.get('employeeCategoryNameEn')?.setValue(myCategory[0].nameEn)
    this.ManagementFormData.get('employeeCategoryId')?.setValue(myCategory[0].id)
    this.ManagementFormData.markAsDirty()

    this.enableEditName = ''
  }

}
