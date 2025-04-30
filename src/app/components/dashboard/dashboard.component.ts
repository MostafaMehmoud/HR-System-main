import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { Response } from 'src/app/shared/interfaces/response';
import { branch, empFullDetails, employeeDetails, oneManage } from 'src/app/shared/interfaces/dashboard';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, filter, map } from 'rxjs';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private _DashboardService: DashboardService, private _Router: Router, private _spinner: NgxSpinnerService, private _FB: FormBuilder) { }

  searchingForm: FormGroup = this._FB.group({
    searchInput: [null],
    excelNameInput: [null, Validators.required]
  })


  // ================= flags =================
  showEmpModal: boolean = false
  showGroubModal: boolean = false
  noEmplyeFound: boolean = false
  noBranchFound: boolean = false
  loadingData: boolean = true
  GroubloadingData: boolean = true
  setting: boolean = false
  showBranch: boolean = false
  displayRows: boolean = false
  displayCards: boolean = true
  dataArrivedRow: boolean = false
  assignedWork: boolean = false  // =========== علي رأس العمل =========

  acvtiveFilterJob: any = null
  acvtiveFilterCompany: any = null
  acvtiveFilterBranch: any = null
  acvtiveFilterNation: any = null
  acvtiveFilterAge: any = null
  acvtiveFilterGender: any = null
  acvtiveFilterKafil: any = null
  acvtiveFilterdepartment: any = null
  theKey: any = null
  detailsRow: boolean = false
  excelModal: boolean = false
  // ================= flags =================


  tempList: string[] = Array(16).fill('0')
  originalEmployeeList: employeeDetails[] = []
  employeeList: employeeDetails[] = []
  originalGroubEmployeeList: employeeDetails[] = []
  groubEmployeeList: employeeDetails[] = []
  originalEmployeeListRow: employeeDetails[] = []
  employeeListRow: employeeDetails[] = []
  managementList: oneManage[] = []
  originalBranchList: branch[] = []
  branchesList: branch[] = []
  searchCategory: string = 'موظف'
  searchKey: string = 'الاسم'
  groubNameKey: string = ''
  OneGroupName: string = 'مجموعة'
  employeeFullData: empFullDetails = {} as empFullDetails
  selectedEmployees: string[] = []
  selectedNumber: number = this.selectedEmployees.length
  selectedGroub: any[] = []
  selectedGrNumber: number = this.selectedGroub.length

  @ViewChild('rowDetails') rowDetailsDiv!: ElementRef

  JobList: any
  CompanyList: any
  branchList: any
  genderList: any
  nationalityList: any
  ageList: any

  ngOnInit(): void {
    this.getAllMangements()
    this.getAllData()
    this.searching()
  }



  // =======================  start filtering function   =======================
  listOfHeaders() {
    this.JobList = new Set(this.employeeList.map(item => { return item.jobNameAr }))
    this.CompanyList = new Set(this.employeeList.map(item => { return item.companyNameAr }))
    this.branchList = new Set(this.employeeList.map(item => { return item.branchNameAr }))
    this.genderList = new Set(this.employeeList.map(item => { return item.gender }))
    this.ageList = new Set(this.employeeList.map(item => { return item.age }))
    this.ageList = Array.from(this.ageList).slice().sort((a, b) => Number(a) - Number(b))
    this.nationalityList = new Set(this.employeeList.map(item => { return item.nationNameAr }))
  }


  JobFilter(list: employeeDetails[], key: any) {
    // this.assignedWork ? list = list.filter((item) => { return item.state == 0 }) : ''
    return list.filter((item) => { return (item.jobNameAr == key || item.jobNameEn == key) })
  }

  companyFilter(list: employeeDetails[], key: any) {
    // this.assignedWork ? list = list.filter((item) => { return item.state == 0 }) : ''
    return list.filter((item) => { return (item.companyNameAr == key || item.companyNameEn == key) })
  }

  BranchFilter(list: employeeDetails[], key: any) {
    // this.assignedWork ? list = list.filter((item) => { return item.state == 0 }) : ''
    return list.filter((item) => { return (item.branchNameAr == key || item.branchNameEn == key) })
  }

  GenderFilter(list: employeeDetails[], key: any) {
    // this.assignedWork ? list = list.filter((item) => { return item.state == 0 }) : ''
    return list.filter((item) => { return item.gender == key })
  }

  nationaltyFilter(list: employeeDetails[], key: any) {
    // this.assignedWork ? list = list.filter((item) => { return item.state == 0 }) : ''
    if (key == 'non-Saudi') {
      return list.filter((item) => { return item.nationNameAr != key && item.nationNameAr != 'بدون جنسية' })
    }
    return list.filter((item) => { return (item.nationNameAr == key || item.nationNameEn == key) })
  }

  ageFilter(list: employeeDetails[], key: any) {
    // this.assignedWork ? list = list.filter((item) => { return item.state == 0 }) : ''
    return list.filter((item) => { return item.age == key })
  }
  kafilFilter(list: employeeDetails[], key: any) {
    // this.assignedWork ? list = list.filter((item) => { return item.state == 0 }) : ''
    return list.filter((item) => { return (item.kafilNameAr == key || item.kafilNameEn == key) })
  }
  departmentFilter(list: employeeDetails[], key: any) {
    // this.assignedWork ? list = list.filter((item) => { return item.state == 0 }) : ''
    return list.filter((item) => { return (item.departmentNameAr == key || item.departmentNameEn == key) })

  }

  stateFilter(list: employeeDetails[], key: any) {
    this.assignedWork ? list = list.filter((item) => { return item.state == 0 }) : ''
    return list.filter((item) => { return item.state == 0 })
  }

  avctiveFilter(type: any, event: any) {

    this.theKey = event.target.value
    type = type.toLowerCase()

    console.log(event.target.value);

    if (type == 'job') {
      if (this.acvtiveFilterJob) {
        this.assignedWork ? this.employeeList = this.originalEmployeeList.filter((item) => { return item.state == 0 }) : this.employeeList = this.originalEmployeeList
        this.acvtiveFilterCompany ? this.employeeList = this.companyFilter(this.employeeList, this.acvtiveFilterCompany) : ''
        this.acvtiveFilterBranch ? this.employeeList = this.BranchFilter(this.employeeList, this.acvtiveFilterBranch) : ''
        this.acvtiveFilterAge ? this.employeeList = this.ageFilter(this.employeeList, this.acvtiveFilterAge) : ''
        this.acvtiveFilterNation ? this.employeeList = this.nationaltyFilter(this.employeeList, this.acvtiveFilterNation) : ''
        this.acvtiveFilterGender ? this.employeeList = this.GenderFilter(this.employeeList, this.acvtiveFilterGender) : ''
        this.acvtiveFilterKafil ? this.employeeList = this.kafilFilter(this.employeeList, this.acvtiveFilterKafil) : ''
        this.theKey == 'all' ? this.acvtiveFilterJob = null : this.acvtiveFilterJob = this.theKey
      }
      else {
        this.theKey == 'all' ? this.acvtiveFilterJob = null : this.acvtiveFilterJob = this.theKey
      }

    }

    if (type == 'company') {

      if (this.acvtiveFilterCompany) {
        this.assignedWork ? this.employeeList = this.originalEmployeeList.filter((item) => { return item.state == 0 }) : this.employeeList = this.originalEmployeeList
        this.acvtiveFilterJob ? this.employeeList = this.JobFilter(this.employeeList, this.acvtiveFilterJob) : ''
        this.acvtiveFilterBranch ? this.employeeList = this.BranchFilter(this.employeeList, this.acvtiveFilterBranch) : ''
        this.acvtiveFilterAge ? this.employeeList = this.ageFilter(this.employeeList, this.acvtiveFilterAge) : ''
        this.acvtiveFilterNation ? this.employeeList = this.nationaltyFilter(this.employeeList, this.acvtiveFilterNation) : ''
        this.acvtiveFilterGender ? this.employeeList = this.GenderFilter(this.employeeList, this.acvtiveFilterGender) : ''
        this.acvtiveFilterKafil ? this.employeeList = this.kafilFilter(this.employeeList, this.acvtiveFilterKafil) : ''
        this.theKey == 'all' ? this.acvtiveFilterCompany = null : this.acvtiveFilterCompany = this.theKey
      }
      else {
        this.theKey == 'all' ? this.acvtiveFilterCompany = null : this.acvtiveFilterCompany = this.theKey
      }

    }

    if (type == 'branch') {

      if (this.acvtiveFilterBranch) {
        this.assignedWork ? this.employeeList = this.originalEmployeeList.filter((item) => { return item.state == 0 }) : this.employeeList = this.originalEmployeeList
        this.acvtiveFilterJob ? this.employeeList = this.JobFilter(this.employeeList, this.acvtiveFilterJob) : ''
        this.acvtiveFilterCompany ? this.employeeList = this.companyFilter(this.employeeList, this.acvtiveFilterCompany) : ''
        this.acvtiveFilterAge ? this.employeeList = this.ageFilter(this.employeeList, this.acvtiveFilterAge) : ''
        this.acvtiveFilterNation ? this.employeeList = this.nationaltyFilter(this.employeeList, this.acvtiveFilterNation) : ''
        this.acvtiveFilterGender ? this.employeeList = this.GenderFilter(this.employeeList, this.acvtiveFilterGender) : ''
        this.acvtiveFilterKafil ? this.employeeList = this.kafilFilter(this.employeeList, this.acvtiveFilterKafil) : ''
        this.theKey == 'all' ? this.acvtiveFilterBranch = null : this.acvtiveFilterBranch = this.theKey
      }
      else {
        this.theKey == 'all' ? this.acvtiveFilterBranch = null : this.acvtiveFilterBranch = this.theKey
      }
    }

    if (type == 'nation') {

      if (this.acvtiveFilterNation) {
        this.assignedWork ? this.employeeList = this.originalEmployeeList.filter((item) => { return item.state == 0 }) : this.employeeList = this.originalEmployeeList
        this.acvtiveFilterJob ? this.employeeList = this.JobFilter(this.employeeList, this.acvtiveFilterJob) : ''
        this.acvtiveFilterCompany ? this.employeeList = this.companyFilter(this.employeeList, this.acvtiveFilterCompany) : ''
        this.acvtiveFilterAge ? this.employeeList = this.ageFilter(this.employeeList, this.acvtiveFilterAge) : ''
        this.acvtiveFilterBranch ? this.employeeList = this.BranchFilter(this.employeeList, this.acvtiveFilterBranch) : ''
        this.acvtiveFilterGender ? this.employeeList = this.GenderFilter(this.employeeList, this.acvtiveFilterGender) : ''
        this.acvtiveFilterKafil ? this.employeeList = this.kafilFilter(this.employeeList, this.acvtiveFilterKafil) : ''
        this.theKey == 'all' ? this.acvtiveFilterNation = null : this.acvtiveFilterNation = this.theKey
      }
      else {
        this.theKey == 'all' ? this.acvtiveFilterNation = null : this.acvtiveFilterNation = this.theKey
      }

    }

    if (type == 'age') {

      if (this.acvtiveFilterAge) {
        this.assignedWork ? this.employeeList = this.originalEmployeeList.filter((item) => { return item.state == 0 }) : this.employeeList = this.originalEmployeeList
        this.acvtiveFilterJob ? this.employeeList = this.JobFilter(this.employeeList, this.acvtiveFilterJob) : ''
        this.acvtiveFilterCompany ? this.employeeList = this.companyFilter(this.employeeList, this.acvtiveFilterCompany) : ''
        this.acvtiveFilterNation ? this.employeeList = this.nationaltyFilter(this.employeeList, this.acvtiveFilterNation) : ''
        this.acvtiveFilterBranch ? this.employeeList = this.BranchFilter(this.employeeList, this.acvtiveFilterBranch) : ''
        this.acvtiveFilterGender ? this.employeeList = this.GenderFilter(this.employeeList, this.acvtiveFilterGender) : ''
        this.acvtiveFilterKafil ? this.employeeList = this.kafilFilter(this.employeeList, this.acvtiveFilterKafil) : ''
        this.theKey == 'all' ? this.acvtiveFilterAge = null : this.acvtiveFilterAge = this.theKey
      }
      else {
        this.theKey == 'all' ? this.acvtiveFilterAge = null : this.acvtiveFilterAge = this.theKey
      }

    }

    if (type == 'gender') {

      if (this.acvtiveFilterGender) {
        this.assignedWork ? this.employeeList = this.originalEmployeeList.filter((item) => { return item.state == 0 }) : this.employeeList = this.originalEmployeeList
        this.acvtiveFilterJob ? this.employeeList = this.JobFilter(this.employeeList, this.acvtiveFilterJob) : ''
        this.acvtiveFilterCompany ? this.employeeList = this.companyFilter(this.employeeList, this.acvtiveFilterCompany) : ''
        this.acvtiveFilterNation ? this.employeeList = this.nationaltyFilter(this.employeeList, this.acvtiveFilterNation) : ''
        this.acvtiveFilterBranch ? this.employeeList = this.BranchFilter(this.employeeList, this.acvtiveFilterBranch) : ''
        this.acvtiveFilterAge ? this.employeeList = this.ageFilter(this.employeeList, this.acvtiveFilterAge) : ''
        this.acvtiveFilterKafil ? this.employeeList = this.kafilFilter(this.employeeList, this.acvtiveFilterKafil) : ''
        this.theKey == 'all' ? this.acvtiveFilterGender = null : this.acvtiveFilterGender = this.theKey
      }
      else {
        this.theKey == 'all' ? this.acvtiveFilterGender = null : this.acvtiveFilterGender = this.theKey
      }

    }


    if (type == 'kafil') {

      if (this.acvtiveFilterKafil) {
        this.assignedWork ? this.employeeList = this.originalEmployeeList.filter((item) => { return item.state == 0 }) : this.employeeList = this.originalEmployeeList
        this.acvtiveFilterJob ? this.employeeList = this.JobFilter(this.employeeList, this.acvtiveFilterJob) : ''
        this.acvtiveFilterCompany ? this.employeeList = this.companyFilter(this.employeeList, this.acvtiveFilterCompany) : ''
        this.acvtiveFilterNation ? this.employeeList = this.nationaltyFilter(this.employeeList, this.acvtiveFilterNation) : ''
        this.acvtiveFilterBranch ? this.employeeList = this.BranchFilter(this.employeeList, this.acvtiveFilterBranch) : ''
        this.acvtiveFilterAge ? this.employeeList = this.ageFilter(this.employeeList, this.acvtiveFilterAge) : ''
        this.theKey == 'all' ? this.acvtiveFilterKafil = null : this.acvtiveFilterKafil = this.theKey
      }
      else {
        this.theKey == 'all' ? this.acvtiveFilterKafil = null : this.acvtiveFilterKafil = this.theKey
      }

    }


    console.log('the key : ', this.theKey);
    console.log('type : ', type);

    this.acvtiveFilterCompany ? this.employeeList = this.companyFilter(this.employeeList, this.acvtiveFilterCompany) : ''
    this.acvtiveFilterBranch ? this.employeeList = this.BranchFilter(this.employeeList, this.acvtiveFilterBranch) : ''
    this.acvtiveFilterJob ? this.employeeList = this.JobFilter(this.employeeList, this.acvtiveFilterJob) : ''
    this.acvtiveFilterAge ? this.employeeList = this.ageFilter(this.employeeList, this.acvtiveFilterAge) : ''
    this.acvtiveFilterNation ? this.employeeList = this.nationaltyFilter(this.employeeList, this.acvtiveFilterNation) : ''
    this.acvtiveFilterGender ? this.employeeList = this.GenderFilter(this.employeeList, this.acvtiveFilterGender) : ''
    this.acvtiveFilterKafil ? this.employeeList = this.kafilFilter(this.employeeList, this.acvtiveFilterKafil) : ''
    // console.log('active filter job : ', this.acvtiveFilterJob);
    // console.log('active filter Company : ', this.acvtiveFilterCompany);
    // console.log('active filter Branch : ', this.acvtiveFilterBranch);
    // console.log('active filter Age : ', this.acvtiveFilterAge);
    // console.log('active filter Nation : ', this.acvtiveFilterNation);
    // console.log('active filter Gender : ', this.acvtiveFilterGender);
    // console.log('active filter Kafil : ', this.acvtiveFilterKafil);

    this.totalPages = Math.ceil(this.employeeList.length / this.itemsPerPage);
    this.currentPage = 1
  }

  counterRowPageFilter(type: any, event: any) {
    this.theKey = event.target.value
    this.OneGroupName = this.theKey
    type = type.toLowerCase()
    console.log('the value : ', event.target.value);
    console.log('the key : ', this.theKey);
    console.log('type : ', type);

    if (type == 'job') {
      this.employeeList = this.originalEmployeeList
      this.acvtiveFilterJob = this.theKey
      this.originalEmployeeListRow = this.JobFilter(this.employeeList, this.acvtiveFilterJob)
      this.employeeListRow = this.originalEmployeeListRow

    }

    if (type == 'company') {
      this.employeeList = this.originalEmployeeList
      this.acvtiveFilterCompany = this.theKey
      this.originalEmployeeListRow = this.companyFilter(this.employeeList, this.acvtiveFilterCompany)
      this.employeeListRow = this.originalEmployeeListRow
    }


    if (type == 'branch') {
      this.employeeList = this.originalEmployeeList
      this.acvtiveFilterBranch = this.theKey
      this.originalEmployeeListRow = this.BranchFilter(this.employeeList, this.acvtiveFilterBranch)
      this.employeeListRow = this.originalEmployeeListRow
    }



    if (type == 'nation') {
      this.employeeList = this.originalEmployeeList
      this.acvtiveFilterNation = this.theKey
      this.originalEmployeeListRow = this.nationaltyFilter(this.employeeList, this.acvtiveFilterNation)
      this.employeeListRow = this.originalEmployeeListRow
      // if assigned ? emplistrow = original.filter : else : emplistrow= original
      // if assigned ? emplistrow = original.filter : else : emplistrow= original
      // if assigned ? emplistrow = original.filter : else : emplistrow= original
      // if assigned ? emplistrow = original.filter : else : emplistrow= original
      // if assigned ? emplistrow = original.filter : else : emplistrow= original
      // if assigned ? emplistrow = original.filter : else : emplistrow= original
      // if assigned ? emplistrow = original.filter : else : emplistrow= original
      // if assigned ? emplistrow = original.filter : else : emplistrow= original
    }


    if (type == 'gender') {
      this.employeeList = this.originalEmployeeList
      this.acvtiveFilterGender = this.theKey
      this.originalEmployeeListRow = this.GenderFilter(this.employeeList, this.acvtiveFilterGender)
      this.employeeListRow = this.originalEmployeeListRow
    }

    if (type == 'kafil') {
      this.employeeList = this.originalEmployeeList
      this.acvtiveFilterKafil = this.theKey
      this.originalEmployeeListRow = this.kafilFilter(this.employeeList, this.acvtiveFilterKafil)
      this.employeeListRow = this.originalEmployeeListRow
    }


    if (type == 'department') {
      this.employeeList = this.originalEmployeeList
      this.acvtiveFilterdepartment = this.theKey
      this.originalEmployeeListRow = this.departmentFilter(this.employeeList, this.acvtiveFilterdepartment)
      this.employeeListRow = this.originalEmployeeListRow
    }


    if (this.assignedWork) {
      this.employeeListRow = this.originalEmployeeListRow.filter((item) => { return item.state == 0 })
    }
    else if (!this.assignedWork) {
      this.employeeListRow = this.originalEmployeeListRow
    }




    console.log('active f job : ', this.acvtiveFilterJob);
    console.log('active f Company : ', this.acvtiveFilterCompany);
    console.log('active f Branch : ', this.acvtiveFilterBranch);
    console.log('active f Age : ', this.acvtiveFilterAge);
    console.log('active f Nation : ', this.acvtiveFilterNation);
    console.log('active f Gender : ', this.acvtiveFilterGender);
    console.log('active f kafil : ', this.acvtiveFilterKafil);
    console.log('active f department : ', this.acvtiveFilterdepartment);



    this.totalPagesDetails = Math.ceil(this.employeeListRow.length / this.itemsPerPage);
    this.currentPageDetails = 1
    setTimeout(() => {
      this.scrollDown()
    }, 100);

  }
  // =======================  end filtering function   =======================




  getAllData(id: string = '') {
    this.employeeList = []
    let body = { "manageId": id }
    this.loadingData = true
    this._spinner.show()
    this.searchCategory = 'موظف'
    this.searchKey = 'الاسم'
    this._DashboardService.getAllDataSmall(body).subscribe({
      next: (data) => {
        this.originalEmployeeList = data.employees
        this.originalEmployeeList = this.originalEmployeeList.slice().sort((a, b) => Number(a.employeeId) - Number(b.employeeId))
        this.assignedWork ? this.employeeList = this.originalEmployeeList.filter((item) => { return item.state == 0 }) : this.employeeList = this.originalEmployeeList
        // this.employeeList = this.employeeList.slice().sort((a, b) => Number(a.employeeId) - Number(b.employeeId))
        this.loadingData = false
        this._spinner.hide()
        this.listOfHeaders()

        this.totalPages = Math.ceil(this.employeeList.length / this.itemsPerPage);
        this.currentPage = 1
      },

      error: (err) => {
        this.loadingData = false
        this._spinner.hide()
        this.noEmplyeFound = true
        console.log(err);
      }
    })
  }

  getAllMangements() {
    this._DashboardService.getAllManages().subscribe({
      next: (Response) => {
        this.managementList = Response
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getOneManage(id: string) {
    this.getAllData(id)
  }

  getAllGroupOf(key: string) {
    this.branchesList = []
    this.loadingData = true
    this._DashboardService.getAllGroubOf(key).subscribe({
      next: (Response) => {
        console.log(Response, 'get all group of');
        this.originalBranchList = Response
        this.originalBranchList = this.originalBranchList.sort((a, b) => Number(a.id) - Number(b.id))
        this.branchesList = this.originalBranchList.slice()
        this.loadingData = false
        this.totalPages = Math.ceil(this.branchesList.length / this.itemsPerPage);
        this.currentPage = 1
      },
      error: (err) => {
        this.loadingData = false
        console.log(err);
      }
    })
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!
  getEmpDetails(empID: any) {
    this.employeeFullData = {} as empFullDetails
    let id = empID
    localStorage.setItem('createdEmpID', empID)

    this._Router.navigate(['./employee-update'])


    // this._DashboardService.getEmpFullData(id).subscribe({

    //   next: (data) => {
    //     this.employeeFullData = data
    //     console.log(data);
    //     this.openEmpModal()
    //   },

    //   error: (err) => {
    //     console.log(err);
    //   }

    // })


  }

  getOneGroubDetails(groubID: string = '', nameAR: any) {
    this.OneGroupName = nameAR
    this.groubEmployeeList = []
    this.GroubloadingData = true
    this._DashboardService.getOneGroup(this.groubNameKey, groubID).subscribe({
      next: (data) => {
        this.OneGroupName = data.nameAr
        this.originalGroubEmployeeList = data.employees
        this.groubEmployeeList = this.originalGroubEmployeeList
        this.GroubloadingData = false
        this.assignedWork ? this.groubEmployeeList = this.originalGroubEmployeeList.filter((item) => { return item.state == 0 }) : this.groubEmployeeList = this.originalGroubEmployeeList
      },
      error: (err) => {
        this.GroubloadingData = false
        console.log(err);
      }
    })

    this.openGroubModal()
  }
  // !!!!!!!!!!!!!!!!!!!!!!!!!













  // ==========================    start searching     =====================
  searching() {
    this.searchingForm.get('searchInput')?.valueChanges
      .pipe(debounceTime(300)).subscribe(value => {  // تأخير التنفيذ بـ 300 مللي ثانية لتحسين الأداء
        this.searchKey == 'الاسم' ? this.searchByName(value) : ''
        this.searchKey == 'الرقم التعريفي' ? this.searchById(value) : ''
        this.searchKey == 'الوظيفة' ? this.searchByJob(value) : ''
      });
  }

  setSearchCategory(key: string, groub: string) {
    this.searchCategory = key
    this.groubNameKey = groub
    this.selectedGroub = []
    this.selectedEmployees = []
    this.selectedGrNumber = 0
    this.selectedNumber = 0
    if (key == 'موظف') {
      this.branchesList = []
      this.getAllData()
      this.acvtiveFilterCompany = null
      this.acvtiveFilterBranch = null
      this.acvtiveFilterJob = null
      this.acvtiveFilterAge = null
      this.acvtiveFilterNation = null
      this.acvtiveFilterGender = null
    }
    else if (key == 'فرع') {
      this.employeeList = []
      this.detailsRow = false
      this.getAllGroupOf(groub)
    }
  }

  setSearchKey(key: string) {
    this.searchKey = key
  }

  searchByName(value: string) {
    if (this.searchCategory == 'موظف') {
      let atWorkOriginalList = this.originalEmployeeList.filter((item) => { return item.state == 0 })
      // this.employeeList = this.originalEmployeeList.filter((item) => { return item.employeeNameAr.includes(value) || String(item.employeeNameEn).toLowerCase().includes(value.toLowerCase()) })
      if (this.assignedWork) {
        this.employeeList = atWorkOriginalList.filter((item) => { return item.employeeNameAr.includes(value) || String(item.employeeNameEn).toLowerCase().includes(value.toLowerCase()) })
      }
      else {
        this.employeeList = this.originalEmployeeList.filter((item) => { return item.employeeNameAr.includes(value) || String(item.employeeNameEn).toLowerCase().includes(value.toLowerCase()) })
      }
      this.totalPages = Math.ceil(this.employeeList.length / this.itemsPerPage);
      this.currentPage = 1
      this.employeeList.length == 0 ? this.noEmplyeFound = true : this.noEmplyeFound = false
    }
    else if (this.searchCategory == 'فرع') {

      this.branchesList = this.originalBranchList.filter((item) => { return item.nameAr.includes(value) || String(item.nameEn).toLowerCase().includes(value.toLowerCase()) })
      this.totalPages = Math.ceil(this.branchesList.length / this.itemsPerPage);
      this.currentPage = 1
      this.branchesList.length == 0 ? this.noBranchFound = true : this.noBranchFound = false
    }
  }

  searchById(value: string) {
    if (this.searchCategory == 'موظف') {
      let atWorkOriginalList = this.originalEmployeeList.filter((item) => { return item.state == 0 })
      if (this.assignedWork) {
        console.log('yes assigned');

        this.employeeList = atWorkOriginalList.filter((item) => { return item.employeeId.includes(value) })
      }
      else {
        console.log('no assigned');

        this.employeeList = this.originalEmployeeList.filter((item) => { return item.employeeId.includes(value) })
      }
      // this.employeeList = this.originalEmployeeList.filter((item) => { return item.employeeId.includes(value) })
      this.totalPages = Math.ceil(this.employeeList.length / this.itemsPerPage);
      this.currentPage = 1
      this.employeeList.length == 0 ? this.noEmplyeFound = true : this.noEmplyeFound = false
    }
    else if (this.searchCategory == 'فرع') {
      this.branchesList = this.originalBranchList.filter((item) => { return item.id.includes(value) })
      this.totalPages = Math.ceil(this.branchesList.length / this.itemsPerPage);
      this.currentPage = 1
      this.branchesList.length == 0 ? this.noBranchFound = true : this.noBranchFound = false
    }
  }

  searchByJob(value: string) {
    this.employeeList = this.originalEmployeeList.filter((item) => { return item.jobNameAr.includes(value) || String(item.jobNameEn).toLowerCase().includes(value.toLowerCase()) })
  }

  setAssignedWork(event: Event) {
    // this function to filter employees who assigned to work and who fired or leave the work 
    let button = event.target as HTMLInputElement
    if (button.checked) {
      this.assignedWork = true
      this.employeeList = this.originalEmployeeList.filter((item) => { return item.state == 0 })
      this.employeeListRow = this.originalEmployeeListRow.filter((item) => { return item.state == 0 })
      this.searchingForm.get('searchInput')?.setValue('')
      console.log('the button : ', button.checked);

    }
    else {
      this.assignedWork = false
      this.employeeList = this.originalEmployeeList
      this.employeeListRow = this.originalEmployeeListRow
      this.searchingForm.get('searchInput')?.setValue('')
      console.log('the button : ', button.checked);

    }


  }
  // ==========================    end searching     ======================






  // ===================== start save To excel =======================
  allEmployeeListId(event: any) {
    // this function will be the ( select all) function
    let status = event.target as HTMLInputElement
    let isCheked = status.checked
    if (isCheked) {
      let allId = this.employeeList.map(item => { return item.employeeId })
      this.selectedEmployees = allId;
      this.selectedNumber = allId.length
      console.log(this.selectedEmployees);
    }
    else {
      this.selectedEmployees.length = 0;
      this.selectedNumber = 0
      console.log(this.selectedEmployees);
    }

  }

  selectGroub(event: any, groubId: any) {
    let status = event.target as HTMLInputElement
    let isCheked = status.checked
    if (isCheked) {
      if (this.selectedGroub.includes(groubId)) {
        this.selectedGrNumber = this.selectedGroub.length
      }
      else {
        this.selectedGroub.push(groubId)
        this.selectedGrNumber = this.selectedGroub.length
      }
    }
    else {
      let IndexOFid = this.selectedGroub.indexOf(groubId)
      this.selectedGroub.splice(IndexOFid, 1)
      this.selectedGrNumber = this.selectedGroub.length
    }
  }

  selectedGrData() {
    let selectedGroubMember: any[] = []
    for (const groubId of this.selectedGroub) {
      this.groubNameKey == 'Nation' ? selectedGroubMember.push(...this.originalEmployeeList.filter((item) => { return item.nationId == groubId })) : ''
      this.groubNameKey == 'Branch' ? selectedGroubMember.push(...this.originalEmployeeList.filter((item) => { return item.branchId == groubId })) : ''
      this.groubNameKey == 'Manage' ? selectedGroubMember.push(...this.originalEmployeeList.filter((item) => { return item.manageId == groubId })) : ''
      this.groubNameKey == 'Job' ? selectedGroubMember.push(...this.originalEmployeeList.filter((item) => { return item.jobId == groubId })) : ''
      this.groubNameKey == 'Company' ? selectedGroubMember.push(...this.originalEmployeeList.filter((item) => { return item.companyId == groubId })) : ''
      this.groubNameKey == 'Department' ? selectedGroubMember.push(...this.originalEmployeeList.filter((item) => { return item.departmentId == groubId })) : ''
      this.groubNameKey == 'Kafil' ? selectedGroubMember.push(...this.originalEmployeeList.filter((item) => { return item.kafilId == groubId })) : ''
    }
    this.assignedWork ? selectedGroubMember = selectedGroubMember.filter((item) => { return item.state == 0 }) : ''
    console.log('selectedGroubMember : ', selectedGroubMember);
    return selectedGroubMember
  }


  selectRow(event: any, empId: any) {

    let status = event.target as HTMLInputElement
    let isCheked = status.checked
    if (isCheked) {
      if (this.selectedEmployees.includes(empId)) {
        this.selectedNumber = this.selectedEmployees.length
      }
      else {
        this.selectedEmployees.push(empId)
        this.selectedNumber = this.selectedEmployees.length
      }
    }
    else {
      let IndexOFid = this.selectedEmployees.indexOf(empId)
      this.selectedEmployees.splice(IndexOFid, 1)
      this.selectedNumber = this.selectedEmployees.length
    }
  }

  sendToExcel() {
    const fileName = this.searchingForm.get('excelNameInput')?.value
    if (fileName) {
      this.setExcelFile(fileName)
    }
    else {
      this.searchingForm.get('excelNameInput')?.markAsTouched()
    }
  }

  openExcelModal() {
    this.excelModal = true
  }

  setExcelFile(name: string) {
    let myData: employeeDetails[] = []
    this.selectedEmployees.length > 0 ? myData = this.employeeList.filter((item) => { return this.selectedEmployees.includes(item.employeeId) }) : ''
    this.selectedGroub.length > 0 ? myData = this.selectedGrData() : ''
    const mySheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(myData)
    const myWorkBook: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(myWorkBook, mySheet, `sheet1`)
    XLSX.writeFile(myWorkBook, `${name}.xlsx`)
    this.selectedEmployees.length = 0
    this.selectedNumber = 0
    this.selectedGroub.length = 0
    this.selectedGrNumber = 0

    this.closeExcelForm()
    this.searchingForm.get('excelNameInput')?.setValue(null)
    this.searchingForm.get('excelNameInput')?.markAsUntouched()


  }


  // ===================== end save To excel =======================




  // ==========================    start moving and (open-close)    ======================
  closeEmpModal() {
    this.showEmpModal = false
  }
  openEmpModal() {
    this.showEmpModal = true
  }
  closeGroubModal() {
    this.showGroubModal = false
  }
  openGroubModal() {
    this.showGroubModal = true
  }

  showSetting() {
    this.setting = !this.setting
  }

  getRandomColor(): string {
    const characters = '123CDE'
    let newColor = '#'
    for (let i = 0; i < 6; i++) {
      newColor += characters[Math.floor(Math.random() * characters.length)]
    }
    return newColor
  }

  scrollUp(type: any) {
    if (type == 'details') {
      let div = this.rowDetailsDiv.nativeElement as HTMLElement
      let divheit = div.offsetTop
      setTimeout(() => {
        window.scrollTo({
          top: divheit,
          left: 0,
          behavior: 'smooth'
        })
      }, 100)
    }

    else {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      }, 100)
    }
  }

  scrollDown() {
    let div = this.rowDetailsDiv.nativeElement as HTMLElement
    let divheit = div.offsetTop
    console.log(divheit);
    window.scrollTo(0, divheit)


  }

  tableView() {
    this.displayCards = false
    this.displayRows = true
  }
  cardsView() {
    this.displayCards = true
    this.displayRows = false
  }

  RowDetailsOpenClose() {
    this.detailsRow = true

  }

  closeExcelForm() {
    this.excelModal = false
  }
  // ==========================    end moving and (open-close)    ======================

  // ==========================   start pagination   ==========================
  itemsPerPage = 100; // عدد العناصر لكل صفحة
  currentPage = 1;
  totalPages = 0;
  maxPagesToShow = 5; // الحد الأقصى لعدد أزرار الصفحات 

  currentPageDetails = 1;
  totalPagesDetails = 0;

  get paginatedResults() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.employeeList.slice(start, end);
  }
  get paginatedBranches() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.branchesList.slice(start, end);
  }
  get paginatedDetails() {
    const start = (this.currentPageDetails - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.employeeListRow.slice(start, end);
  }


  goToPage(page: number, useFor: any) {
    useFor == 'normal' ? this.currentPage = page : ''
    useFor == 'details' ? this.currentPageDetails = page : ''
    useFor == 'details' ? this.scrollUp('details') : this.scrollUp('')

  }

  nextPage(useFor: any) {
    if (useFor == 'normal') {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.scrollUp('')
      }
    }
    else if (useFor == 'details') {
      if (this.currentPageDetails < this.totalPagesDetails) {
        this.currentPageDetails++;
        this.scrollUp('details')
      }
    }

  }

  prevPage(useFor: any) {
    if (useFor == 'normal') {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.scrollUp('')
      }
    }
    else if (useFor == 'details') {
      if (this.currentPageDetails > 1) {
        this.currentPageDetails--;
        this.scrollUp('details')
      }
    }
  }

  firstPage(useFor: any) {
    useFor == 'normal' ? this.currentPage = 1 : ''
    useFor == 'details' ? this.currentPageDetails = 1 : ''
    useFor == 'details' ? this.scrollUp('details') : this.scrollUp('')
  }

  lastPage(useFor: any) {
    useFor == 'normal' ? this.currentPage = this.totalPages : ''
    useFor == 'details' ? this.currentPageDetails = this.totalPagesDetails : ''
    useFor == 'details' ? this.scrollUp('details') : this.scrollUp('')
  }

  get pagesArray() {
    const startPage = Math.max(1, this.currentPage - Math.floor(this.maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + this.maxPagesToShow - 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  get pagesArrayDetails() {
    const startPage = Math.max(1, this.currentPageDetails - Math.floor(this.maxPagesToShow / 2));
    const endPage = Math.min(this.totalPagesDetails, startPage + this.maxPagesToShow - 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
  // ==========================   end pagination   ==========================


  ngOnDestroy(): void {
    this.employeeList = []
    this.loadingData = false
    this._spinner.hide()
  }

}
