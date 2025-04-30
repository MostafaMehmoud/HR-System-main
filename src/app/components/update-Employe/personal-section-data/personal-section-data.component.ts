import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, Subscription } from 'rxjs';
import { branch, empFullDetails } from 'src/app/shared/interfaces/dashboard';
import { modifiedEmployee } from 'src/app/shared/interfaces/update-data';
import { UpdateDataService } from 'src/app/shared/services/update-data.service';

@Component({
  selector: 'app-personal-section-data',
  templateUrl: './personal-section-data.component.html',
  styleUrls: ['./personal-section-data.component.css']
})
export class PersonalSectionDataComponent {
  constructor(private _FormBuilder: FormBuilder, private _UpdateDataService: UpdateDataService, private _spinner: NgxSpinnerService,
    private _Router: Router, private _toaster: ToastrService, private _TranslateService: TranslateService) { }
  oneEmpolyee: empFullDetails = {} as empFullDetails
  itemsList: any[] = []
  enableEdit: boolean = false
  showData: boolean = false
  modifiedEmployee: modifiedEmployee = this._UpdateDataService.newEmpData;
  originalAllGroups: branch[] = []
  allgroups: branch[] = []
  nationList: branch[] = []
  enableEditName: string = ''
  branchChosen: boolean = true
  isFormChanged: boolean = false;
  ibnList: any[] = ['1', 2, 3, 4, 5]
  mySubscription!: Subscription


  personalDataForm: FormGroup = this._FormBuilder.group({
    // معلومات الاتصال
    mobile: [null],
    mobileEmergency: [null],
    // معلومات الجنسية
    nationId: [{ value: null, disabled: true }],
    nationNameAr: [null],
    nationNameEn: [null],
    // الحالة
    state: [null],
    blood: [null],
  })

  get currentLang() {
    return this._TranslateService.currentLang
  }


  editSingleRow(element: any, target: any) {
    let x = this.personalDataForm.get(element)?.enable()

    const button = target as HTMLElement
    let updateButton = button.parentElement?.children[0] as HTMLElement
    let saveButton = button.parentElement?.children[1] as HTMLElement
    let cancelButton = button.parentElement?.children[2] as HTMLElement

    updateButton.style.display = 'none'
    saveButton.style.display = 'flex'
    cancelButton.style.display = 'flex'
  }

  closeEdittingInput(formCntrolName: any, target: any, originalValue: any, action: string) {
    let input = this.personalDataForm.get(formCntrolName)

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












  ngOnInit(): void {
    this.getEmpData()
    this.getAllNations()
    this.monitorFormChanges()

    this.isCurrentSection()
  }

  isCurrentSection() {
    this.mySubscription = this._UpdateDataService.sendDataNow.subscribe(value => {
      if (value) {
        console.log('send personal-section data');
        this.sendUpdates()
      }
    })
  }

  ngOnDestroy(): void {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }


  sayHello() {
    console.log('helloooooooooooooooooo');
    return "helloooooo"
  }


  monitorFormChanges() {
    this.personalDataForm.valueChanges.subscribe(() => {
      // تحقق إذا تم تعديل النموذج
      this.isFormChanged = this.personalDataForm.dirty; // dirty تتحقق مما إذا كان هناك أي تعديل
      this._UpdateDataService.isFormChanged.next(this.personalDataForm.dirty)

    });
  }

  getEmpData() {
    this._UpdateDataService.employeeData.subscribe(
      (value) => {
        console.log(value);
        this.oneEmpolyee = value
        this.personalDataForm.patchValue(this.oneEmpolyee)
        this._UpdateDataService.isFormChanged.next(false)

      }
    )

  }

  // =========================== start ===========================
  // تعديل احد الخانات الاختيارية مثل الشركة او الفرع .. الخ
  getAllGroubOf(key: string, control: string) {
    this._UpdateDataService.getAllGroubOf(key).subscribe({
      next: (response) => {
        this.allgroups = response
        this.allgroups = this.allgroups.sort((a, b) => Number(a.id) - Number(b.id))
        this.originalAllGroups = this.allgroups
        console.log(response);
        this.groubSearching(control)
        this.enableEditName = control
        // بديله اسم الخانة اللي بيتم التعديل عليها و دي اللي هيظهر الليست تحتها
      }
    })
  }

  groubSearching(control: string) {
    this.personalDataForm.get(control)?.valueChanges
      .pipe(debounceTime(300)).subscribe(value => {  // تأخير التنفيذ بـ 300 مللي ثانية لتحسين الأداء
        this.searchByName(value)
        this.branchChosen = false
      });
  }

  searchByName(value: string) {
    this.allgroups = this.originalAllGroups.filter((item) => { return item.nameAr.includes(value) || (item.nameEn ? (item.nameEn).toLocaleLowerCase().includes(value.toLocaleLowerCase()) : '') || item.id.includes(value) })
    console.log(this.allgroups);
  }

  setChosenValue(item: branch, ControlNameAr: string, ControlNameEn: string, ControlID: string, target: any, thisControl: string) {
    this.personalDataForm.get(ControlNameAr)?.setValue(item.nameAr);
    this.personalDataForm.get(ControlNameEn)?.setValue(item.nameEn);
    this.personalDataForm.get(ControlID)?.setValue(item.id);
    this.enableEditName = ''
    this.branchChosen = true

    this.closeEdittingInput(thisControl, target, '', 'save')
    console.log(item);
  }

  getAllNations() {
    this._UpdateDataService.getAllGroubOf('nation').subscribe({
      next: (data) => {
        this.nationList = data
        this.nationList = this.nationList.sort((a, b) => Number(a.id) - Number(b.id))
        console.log(data);
      },
      error: (err) => {
        console.log(err);

      }
    })
  }
  // تعديل احد الخانات الاختيارية مثل الشركة او الفرع .. الخ
  // =========================== end ===========================


  setNation(controlName: string) {
    let nationName: string = this.personalDataForm.get(controlName)?.value
    let myNation = this.nationList.filter((item) => { return item.nameAr == nationName || item.nameEn == nationName })

    this.personalDataForm.get('nationNameAr')?.setValue(myNation[0].nameAr)
    this.personalDataForm.get('nationNameEn')?.setValue(myNation[0].nameEn)
    this.personalDataForm.get('nationId')?.setValue(myNation[0].id)
    this.personalDataForm.markAsDirty()

    this.enableEditName = ''
    this.branchChosen = true
  }


  equalizeData() {
    // نقوم بجلب الخصائص الموجودة في الـ partialObject فقط
    const updatedObject = Object.assign({}, ...Object.keys(this.modifiedEmployee)
      .filter(key => key in this.oneEmpolyee)
      .map(key => ({ [key]: this.oneEmpolyee[key as keyof empFullDetails] })));
    this.modifiedEmployee = updatedObject
  }

  setUpdates() {
    this.equalizeData()
    this.modifiedEmployee.mobile = this.ifValueSetString(this.personalDataForm.get('mobile')?.value)
    this.modifiedEmployee.mobileEmergency = this.ifValueSetString(this.personalDataForm.get('mobileEmergency')?.value)
    this.modifiedEmployee.nationId = this.personalDataForm.get('nationId')?.value
    this.modifiedEmployee.state = this.personalDataForm.get('state')?.value
    this.modifiedEmployee.blood = this.personalDataForm.get('blood')?.value
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
        this._spinner.hide("spinner2")
        this._toaster.error('لم يتم تحديث بيانات الموظف .. حاول لاحقاً ', "فشل التعديل", { positionClass: 'toast-bottom-right' })
        console.log(err)
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
        this._UpdateDataService.employeeData.next(data)
        this.isFormChanged = false
        this._UpdateDataService.isFormChanged.next(false)
      },
      error: (err) => {
        console.log(err);
      }
    })
  }


}


