import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, Event } from '@angular/router';
import { BehaviorSubject, debounceTime, Subscription } from 'rxjs';
import { empFullDetails } from 'src/app/shared/interfaces/dashboard';
import { oneEmployee } from 'src/app/shared/interfaces/update-data';
import { UpdateDataService } from 'src/app/shared/services/update-data.service';
import { PersonalSectionDataComponent } from './../personal-section-data/personal-section-data.component';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-emp-update',
  templateUrl: './emp-update.component.html',
  styleUrls: ['./emp-update.component.css']
})
export class EmpUpdateComponent implements OnInit, OnDestroy {
  @ViewChild(PersonalSectionDataComponent) myIbn!: PersonalSectionDataComponent
  constructor(private _FormBuilder: FormBuilder, private _UpdateDataService: UpdateDataService, private _toaster: ToastrService,
    private _Router: Router, private _Renderer2: Renderer2, private _spinner: NgxSpinnerService) { }
  searchingForm: FormGroup = this._FormBuilder.group({
    searchInput: [null]
  })



  employeeData: FormGroup = this._FormBuilder.group({
    empName: [{ value: null, disabled: true }],
    empJob: [{ value: null, disabled: true }],
    empCompany: [{ value: null, disabled: true }],
    empBranch: [{ value: null, disabled: true }],
    empManage: [{ value: null, disabled: true }],
  })


  showList: boolean = false
  employeeList: oneEmployee[] = []
  oneEmplyee: empFullDetails = {} as empFullDetails
  enableEdit: boolean = false
  showData: boolean = false
  sendingData: boolean = false
  isFormChanged: boolean = false
  statusSubscribtion!: Subscription

  sendData() {
    this._UpdateDataService.sendDataNow.next(true)
    this._UpdateDataService.sendDataNow.next(false)
  }

  forgetChanges() {
    this._UpdateDataService.employeeData.next(this._UpdateDataService.employeeData.value)
    this._UpdateDataService.isFormChanged.next(false)
    this._toaster.warning('تم اهمال التعديلات الحالية', " اهمال ", { positionClass: 'toast-bottom-right' })

  }

  getFormStatus() {
    this.statusSubscribtion = this._UpdateDataService.isFormChanged.subscribe(vlaue => {
      this.isFormChanged = vlaue
      console.log(vlaue);

    })
  }

  ngOnInit(): void {
    this.searchingForm.get('searchInput')?.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      if (value) {
        console.log(value, 'there is value');
        this.searchEmp(value)
        this.showList = true
        this.showData = false
      }
      else {
        console.log(value, 'there is no value');
        this.employeeList = []
        this.showList = false
      }

    })

    this.isNewEmployee()
    this.getFormStatus()
  }


  searchEmp(key: string) {
    this._UpdateDataService.searchEmployee(key).subscribe({
      next: (data) => {
        console.log(data);
        this.employeeList = data.employees
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getEmployeeDetails(empID: string) {
    this._spinner.show('spinner3')
    this._UpdateDataService.getEmpFullData(empID).subscribe({
      next: (data) => {
        console.log(data);
        this._UpdateDataService.employeeData.next(data)
        console.log(data, 'daaataaa -empupdate');
        this.oneEmplyee = data
        this.showList = false
        this.showData = true
        this._spinner.hide('spinner3')

      },
      error: (err) => {
        console.log(err);
        this._spinner.hide('spinner3')

      }
    })
  }

  editSingleRow(element: any, target: any) {
    let x = this.employeeData.get(element)?.enable()

    const button = target as HTMLElement
    let updateButton = button.parentElement?.children[0] as HTMLElement
    let saveButton = button.parentElement?.children[1] as HTMLElement
    let cancelButton = button.parentElement?.children[2] as HTMLElement

    updateButton.style.display = 'none'
    saveButton.style.display = 'flex'
    cancelButton.style.display = 'flex'
  }

  closeEdittingInput(formCntrolName: any, target: any, originalValue: any, action: string) {
    let input = this.employeeData.get(formCntrolName)

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

  isNewEmployee() {
    // مهمة الفانكشن هي اذا كان هذا موظف جديد اي تم توجيهه من صفحة اضافة موظف
    //  ان ياخذ الاي دي من التخزين المحلي و يجلب بياناته و يجعله جاهز للتعديل
    if (localStorage.getItem('createdEmpID')) {
      this.getEmployeeDetails(localStorage.getItem('createdEmpID')!)
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('createdEmpID')
    this.statusSubscribtion.unsubscribe()
  }
}
