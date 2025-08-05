import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AddEditComponent } from 'src/app/shared/components/modals/add-edit/add-edit.component';
import { configuration } from 'src/app/shared/interfaces/config';
import { JobService } from 'src/app/shared/services/job/job.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css' , '../../shared/configration.css']
})

export class JobComponent implements OnInit {
  configurationName = 'Dashboard.الوظيفة'
  NameAr = 'jobNameAr'
  NameEn = 'jobNameEn'
  @ViewChild(AddEditComponent) addEditComponent!: AddEditComponent;

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;
  // Detect clicks outside
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.dropdownRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.filteredArr = [];
      // this.settingForm.get('searchInput')?.setValue('');
    }
  }

  openModal() {
    this.addOrEdit = 'add';
    this.resetVar()
    setTimeout(() => {
      this.addEditComponent?.open();
    });
  }

  settingForm: FormGroup = this._FormBuilder.group({
    searchInput: [null],
    deleteSelected: [null],
  })

  addOrEdit = ''
  wrongError = false
  configurationForm: FormGroup;
  textError = ''
  id: any = 0
  filterSelected = 'all'
  filteredArr: any = [];

  submited = false

  currentPage: number = 1;
  itemsPerPage: number = 10;

  jobs: configuration[] = [];
  originalAllItems: configuration[] = []


  get currentLang() {
    return this._TranslateService.currentLang
  }

  constructor(
    private jobService: JobService,
    private translate: TranslateService,
    private _FormBuilder: FormBuilder,
    private _TranslateService: TranslateService,
    private _spinner: NgxSpinnerService,
    private _toaster: ToastrService,
  ) {
    this.configurationForm = this._FormBuilder.group({
      jobNameAr: ['', Validators.required],
      jobNameEn: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAlljobs();
  }

  getAlljobs() {
    this.jobService.getAllJobs().subscribe({
      next: (res) => {
        this.jobs = res.data
        if (this.jobs.length > 0) {
          this.jobs.forEach((obj: any) => obj.checked = false);
        }
        this.originalAllItems = this.jobs
      },
      error: (err) => console.error(err)
    });
  }

  onSearchChange(): void {
    const value = this.settingForm.get('searchInput')?.value.toLowerCase() || '';
    console.log('value', value)
    if (!value) {
      this.jobs = this.originalAllItems
      this.filteredArr = [];
      return;
    }

    this.filteredArr = this.originalAllItems.filter((item: any) => {
      const idMatch = item.id.includes(value);
      const nameMatch = this.currentLang == 'ar'
        ? item.nameAr.includes(value)
        : item.nameEn.toLowerCase().includes(value);
      return this.filterSelected == 'all' ? idMatch || nameMatch : this.filterSelected == 'name' ? nameMatch : idMatch;
    });
  }

  selectItem(item: any): void {
    console.log('item', item)
    this.settingForm.get('searchInput')?.setValue(this.filterSelected == 'id' ? item.id : this.currentLang === 'ar' ? item.nameAr : item.nameEn);
    this.filteredArr = [];
    this.jobs = [item]
    // You can emit or use the selected item here
  }

  filterClicked(item: any) {
    this.filterSelected = item
    this.jobs = this.originalAllItems
    this.settingForm.get('searchInput')?.setValue('');
  }

  groupBy(groupBy: string) {
    if (groupBy == 'id') {
      this.jobs = this.jobs.sort((a, b) => Number(a.id) - Number(b.id))
    } else {
      this.jobs = this.jobs.sort((a: any, b: any) => this.currentLang == 'ar' ? a.nameAr.localeCompare(b.nameAr) : a.nameEn.localeCompare(b.nameEn));
    }
  }

  addEdit() {
    this.submited = true;
    if (this.configurationForm.valid) {
      this._spinner.show('spinner2')
      if (this.addOrEdit == 'add') {
        this.jobService.addJob(this.configurationForm.value).subscribe({
          next: res => {
            this.wrongError = false
            this._spinner.hide('spinner2')
            console.log(res);
            if (res.success) {
              this._toaster.success(this.translate.instant('JOBS.SuccessTitle'));
              this.textError = ''
              this.addEditComponent?.close();
              this.getAlljobs();
            } else {
              this.textError = this.translate.instant('JOBS.ErrorMessage')
            }
          },
          error: err => {
            this.textError = ''
            this.wrongError = true
            console.log(err)
            this._spinner.hide('spinner2')
            console.log(err);
          }
        });
      } else {
        let body = {
          'id': this.id,
          'jobNameAr': this.configurationForm.value.jobNameAr,
          'jobNameEn': this.configurationForm.value.jobNameEn,
        }
        this.jobService.updateJob(body).subscribe({
          next: (res) => {
            this.wrongError = false
            this._spinner.hide('spinner2')
            if (res.success) {
              this._toaster.success(this.translate.instant('JOBS.updated'));
              this.textError = ''
              this.getAlljobs();
              this.addEditComponent?.close();
            } else {
              this.textError = this.translate.instant('JOBS.ErrorMessage2')
            }
          },
          error: (err) => {
            this.wrongError = true
            this.textError = ''
            console.log(err)
            this._spinner.hide('spinner2')
          }
        });
      }
    }
  }

  getUpdateData(item: any) {
    this.textError = ''
    this.addOrEdit = 'edit';
    this.configurationForm.patchValue({
      jobNameAr: item.nameAr, // Adjust if necessary based on your response
      jobNameEn: item.nameEn  // Adjust if necessary based on your response
    });
    this.id = item.id
    this.submited = false;
    this.wrongError = false;
  }

  confirmDelete(id: number) {
    Swal.fire({
      title: this.translate.instant('JOBS.DeleteConfirmTitle'),
      text: this.translate.instant('JOBS.DeleteConfirm'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('COMMON.YesDelete'),
      cancelButtonText: this.translate.instant('COMMON.Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.jobService.deleteJob(id.toString()).subscribe({
          next: (res) => {
            console.log(res);
            if (res.success) {
              this.getAlljobs();
              Swal.fire(
                this.translate.instant('COMMON.Deleted'),
                this.translate.instant('JOBS.Success'),
                'success'
              );
            } else {
              Swal.fire(
                this.translate.instant('COMMON.Error'),
                this.translate.instant('JOBS.Error'),
                'error'
              );
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire(
              this.translate.instant('COMMON.Error'),
              this.translate.instant('JOBS.Error'),
              'error'
            );
          }
        });
      }
    });
  }


  preventDefault() {
    this.addEdit()
    return false;
  }


  resetVar() {
    this.configurationForm.patchValue({
      jobNameAr: '',
      jobNameEn: ''
    });
    this.submited = false;
    this.wrongError = false
  }

  isAnyChecked() {
    return this.jobs.some((item: any) => item.checked);
  }

  //  DeleteItem(Id: any) {
  //   Swal.fire({
  //     title: this.currentLang == 'ar' ? 'هل انت متاكد من الحذف ؟' : 'Are you sure you want to delete?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: this.currentLang == 'ar' ? 'حسناً' : 'Yes',
  //     cancelButtonText: this.currentLang == 'ar' ? 'اغلاق' : 'Cancel'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       let body: any = {
  //         ids: Array.isArray(Id) ? Id : [Id]
  //       }
  //       this._http.delete(`${environment.apiUrl}/Api/Group/${this.nodeSelect}/DeleteGroupItem`, {
  //         body, responseType: 'text' as 'json'
  //       }).subscribe({
  //         next: () => {
  //           Swal.fire({
  //             title: this.currentLang === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully',
  //             text: '',
  //             icon: 'success',
  //             confirmButtonText: this.currentLang === 'ar' ? 'موافق' : 'OK'
  //           });
  //           this.getAlljobs()
  //         },
  //         error: () => {
  //           Swal.fire({
  //             title: this.currentLang === 'ar' ? 'خطأ' : 'Error',
  //             text: '',
  //             icon: 'error',
  //             confirmButtonText: this.currentLang === 'ar' ? 'موافق' : 'OK'
  //           });
  //         }
  //       });
  //     }
  //   });

  // }

  // DeleteGroup() {
  //   let ids = this.jobs.filter((obj) => obj.checked).map(item => item.id)
  //   this.DeleteItem(ids)
  // }

}