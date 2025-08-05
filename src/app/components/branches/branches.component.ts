import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { configuration } from 'src/app/shared/interfaces/config';
import { BranchService } from 'src/app/shared/services/branches/branch.service';
import { CompanyService } from 'src/app/shared/services/company.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css' , '../../shared/configration.css']
})

export class BranchesComponent implements OnInit {
  configurationName = 'Dashboard.الفرع'
  NameAr = 'branchNameAr'
  NameEn = 'branchNameEn'
  @ViewChild('modalCloseBtn') modalCloseBtn!: ElementRef;

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

  branches: configuration[] = [];
  companies: configuration[] = [];
  originalAllItems: configuration[] = []


  get currentLang() {
    return this._TranslateService.currentLang
  }

  constructor(
    private companyService: CompanyService,
    private branchService: BranchService,
    private translate: TranslateService,
    private _FormBuilder: FormBuilder,
    private _TranslateService: TranslateService,
    private _spinner: NgxSpinnerService,
    private _toaster: ToastrService,
  ) {
    this.configurationForm = this._FormBuilder.group({
      branchNameAr: ['', Validators.required],
      branchNameEn: ['', Validators.required],
      companyId: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
    this.getAllCompanies();
    this.getAllBranches();
  }

  getAllCompanies() {
    this.companyService.getAllCompanies().subscribe({
      next: (res) => {
        this.companies = res.data
        if (this.companies.length > 0) {
          this.companies.forEach((obj: any) => obj.checked = false);
        }
        this.originalAllItems = this.companies
      },
      error: (err) => console.error(err)
    });
  }

  getAllBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (res) => {
        this.branches = res.data
        this.branches.forEach((obj: any) => obj.checked = false);
        this.originalAllItems = this.branches
      },
      error: (err) => console.error(err)
    });
  }

  onSearchChange(): void {
    const value = this.settingForm.get('searchInput')?.value.toLowerCase() || '';
    console.log('value', value)
    if (!value) {
      this.branches = this.originalAllItems
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
    this.branches = [item]
    // You can emit or use the selected item here
  }

  filterClicked(item: any) {
    this.filterSelected = item
    this.branches = this.originalAllItems
    this.settingForm.get('searchInput')?.setValue('');
  }

  groupBy(groupBy: string) {
    if (groupBy == 'id') {
      this.branches = this.branches.sort((a, b) => Number(a.id) - Number(b.id))
    } else {
      this.branches = this.branches.sort((a: any, b: any) => this.currentLang == 'ar' ? a.nameAr.localeCompare(b.nameAr) : a.nameEn.localeCompare(b.nameEn));
    }
  }

  addEdit() {
    this.submited = true;
    if (this.configurationForm.valid) {
      this._spinner.show('spinner2')
      if (this.addOrEdit == 'add') {
        this.branchService.addBranch(this.configurationForm.value).subscribe({
          next: res => {
            this.wrongError = false
            this._spinner.hide('spinner2')
            console.log(res);
            if (res.success) {
              this._toaster.success(this.translate.instant('BRANCHES.SuccessTitle'));
              this.textError = ''
              this.modalCloseBtn.nativeElement.click();
              this.getAllBranches();
            } else {
              this.textError = this.translate.instant('BRANCHES.ErrorMessage')
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
          'branchNameAr': this.configurationForm.value.branchNameAr,
          'branchNameEn': this.configurationForm.value.branchNameEn,
          'companyId': this.configurationForm.value.companyId,
        }
        this.branchService.updateBranch(body).subscribe({
          next: (res) => {
            this.wrongError = false
            this._spinner.hide('spinner2')
            if (res.success) {
              this._toaster.success(this.translate.instant('BRANCHES.updated'));
              this.textError = ''
              this.getAllBranches();
              this.modalCloseBtn.nativeElement.click();
            } else {
              this.textError = this.translate.instant('BRANCHES.ErrorMessage')
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
      branchNameAr: item.nameAr,
      branchNameEn: item.nameEn,
      companyId: item.companyId
    });
    this.id = item.id
    this.submited = false;
    this.wrongError = false;
  }

  confirmDelete(id: number) {
    Swal.fire({
      title: this.translate.instant('BRANCHES.DeleteConfirmTitle'),
      text: this.translate.instant('BRANCHES.DeleteConfirm'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('COMMON.YesDelete'),
      cancelButtonText: this.translate.instant('COMMON.Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.branchService.deleteBranch(id.toString()).subscribe({
          next: (res) => {
            console.log(res);
            if (res.success) {
              this.getAllBranches();
              Swal.fire(
                this.translate.instant('COMMON.Deleted'),
                this.translate.instant('BRANCHES.Success'),
                'success'
              );
            } else {
              Swal.fire(
                this.translate.instant('COMMON.Error'),
                this.translate.instant('BRANCHES.Error'),
                'error'
              );
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire(
              this.translate.instant('COMMON.Error'),
              this.translate.instant('BRANCHES.Error'),
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
      branchNameAr: '',
      branchNameEn: '',
      companyId : ''
    });
    this.submited = false;
    this.wrongError = false
  }

  isAnyChecked() {
    return this.branches.some((item: any) => item.checked);
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
  //           this.getAllBranches()
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
  //   let ids = this.branches.filter((obj) => obj.checked).map(item => item.id)
  //   this.DeleteItem(ids)
  // }

}