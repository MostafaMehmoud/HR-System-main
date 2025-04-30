import { formatDate } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Profile } from 'src/app/shared/interfaces/profile';
import { MyProfileService } from 'src/app/shared/services/my-profile.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  constructor(private _MyProfileService: MyProfileService, private _router: Router, private _FormBuilder: FormBuilder, private _Renderer2: Renderer2, private _toaster: ToastrService, private spinner: NgxSpinnerService) { }

  @ViewChild('imgInputEl') imgElement!: ElementRef
  @ViewChild('imgModal') imgModal!: ElementRef

  imgForm: FormGroup = this._FormBuilder.group({
    imgInput: [null, Validators.required]
  }, { validators: [this.imgType] } as FormControlOptions)



  allDetails: Profile = {} as Profile



  // ========================== start Flags ===========================
  isLoading: Boolean = false
  imgSizeError: boolean = false
  dataArrive: boolean = false
  isAdmin: Boolean = false

  // ========================== start head section ===========================
  empNameAR: string = localStorage.getItem('employeeNameAR')!
  empNameEN: string = localStorage.getItem('employeeNameEN')!
  empID: string = ' **** '
  empImg: any = null
  saudiMen: string = './assets/images/non-compressed/arabi_men.jpg'
  imgSrc: any = null

  // ======================  start personal section ===========================
  jobNameAr: any = ' . . . '
  jobNameEn: any = ' . . . '
  mobile: any = ' . . . '
  mobileEmergency: any = ' . . . '
  departmentAr: any = ' . . . '
  departmentEn: any = ' . . . '
  identityNumber: any = ' . . . '
  identityExpire: any = ' . . . '
  bloodType: any = ' . . . '

  // ========================     start document section       ===========================
  passportNumber: any = ' . . . '
  endPassport: any = ' . . . '
  contractStart: any = ' . . . '
  contractEnd: any = ' . . . '
  carNumber: any = ' . . . '
  checkCarEnd: any = ' . . . '
  contractCarEnd: any = ' . . . '





  ngOnInit(): void {
    this.spinner.show()
    this._MyProfileService.getProfileDetails().subscribe({
      next: (data) => {
        this.allDetails = data
        this._MyProfileService.srcData.next(this.allDetails)

        this.empNameAR = this.allDetails.employeeInfo.nameAr
        this.empNameEN = this.allDetails.employeeInfo.nameEn
        this.jobNameAr = this.allDetails.employeeInfo.jobNameAr
        this.jobNameEn = this.allDetails.employeeInfo.jobNameEn
        this.mobile = this.allDetails.employeeInfo.mobile
        this.mobileEmergency = this.allDetails.employeeInfo.mobileEmergency
        this.departmentAr = this.allDetails.employeeInfo.depatmentNameAr
        this.departmentEn = this.allDetails.employeeInfo.depatmentNameEn
        this.bloodType = this.allDetails.employeeInfo.bloodType

        this.passportNumber = this.allDetails.passportInfo.passportNumber
        this.endPassport = this.allDetails.passportInfo.expiredDate
        this.contractStart = this.allDetails.contractInfo.startDate
        this.contractEnd = this.allDetails.contractInfo.endDate
        this.identityNumber = this.allDetails.identityInfo.identityNumber
        this.identityExpire = this.allDetails.identityInfo.expiredDate
        this.carNumber = this.allDetails.carInfo.carNumber
        this.checkCarEnd = this.allDetails.carInfo.checkCarEndDate
        this.contractCarEnd = this.allDetails.carInfo.contractCarEndDate
        //                                     there is  data ?   if no put saudiImg  ,   if yes put the base64+pic     
        this.empImg = this.allDetails.employeeInfo.image == null ? this.saudiMen : 'data:;base64,' + this.allDetails.employeeInfo.image
        this.empID = this.allDetails.employeeInfo.id
        console.log(this.allDetails);
        this.spinner.hide()
        this.dataArrive = true
      },


      error: (err) => {

        this.spinner.hide()
        console.log(err);
        if (err.error.message == 'Unauthorized') {
          localStorage.clear()
          this._router.navigate(['login'])
        }
      },
    })
    this.adminOrEmp()

  }



  setFormData() {
    let myBody = new FormData()
    const fileInput = this.imgElement.nativeElement;
    if (fileInput.files.length > 0) {
      myBody.append('image', fileInput.files[0]);
    } else {
      console.log('No file selected');
    }
    return myBody
  }

  sendImg() {
    if (this.imgForm.valid && !this.imgSizeError) {
      this.spinner.show() // show loading
      this._MyProfileService.updateImg(this.setFormData()).subscribe({
        next: (response) => {
          if (response == true) {
            this._MyProfileService.getProfileDetails().subscribe({
              next: (data) => {
                this.empImg = ('data:;base64,' + data.employeeInfo.image)
                this.spinner.hide()
                this.closeImgModal()
                this._toaster.success('تم تحديث صورة الملف الشخصي ')
              }
            })
          }
        },
        error: (err) => {
          this.spinner.hide()
          console.log(err);
        }
      })
    }
    else {
      this.imgForm.markAllAsTouched()
    }
  }



  moveDown() {
    window.scrollTo(0, screen.height)
  }

  adminOrEmp() {
    if (localStorage.getItem('userRole')) {
      this.isAdmin = true
    }
    else {
      this.isAdmin = false
    }
  }

  showImgModal() {
    this._Renderer2.removeClass(this.imgModal.nativeElement, 'd-none')
  }

  closeImgModal() {
    this._Renderer2.addClass(this.imgModal.nativeElement, 'd-none')
  }

  imgType(myForm: FormGroup) {
    const allowedExtensions = ['jpg', 'jpeg', 'png']
    let fileName: string = myForm.get('imgInput')?.value
    if (fileName) {
      let fileType = fileName.split('.').pop()?.toLowerCase()
      // اذا لم يكن الملف من الملفات المدعومة
      if (!allowedExtensions.includes(fileType!)) {
        console.log(fileType);
        myForm.get('imgInput')?.setErrors({ 'type': true })
      }
    }
    return null
  }

  // manual validation for img size (max 2mb)
  imgSize() {
    let file: string = this.imgForm.get('imgInput')?.value
    if (file) {
      const fileInput = this.imgElement.nativeElement;
      // --------------  this number = 2mb 
      if (fileInput.files[0].size > 2097151) {
        this.imgSizeError = true
      }
      else {
        this.imgSizeError = false
      }
    }
    else {
      this.imgSizeError = false
    }

  }
}
