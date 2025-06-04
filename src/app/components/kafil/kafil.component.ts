import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { configuration } from 'src/app/shared/interfaces/config';
import { KafilService } from 'src/app/shared/services/kafil/kafil.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-kafil',
  templateUrl: './kafil.component.html',
  styleUrls: ['./kafil.component.css']
})

export class KafilComponent implements OnInit {
  configurationName = 'Dashboard.كفيل'
  NameAr = 'kafilNameAr'
  NameEn = 'kafilNameEn'

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;
  @ViewChild('modalCloseBtn') modalCloseBtn!: ElementRef;

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

  kafils: configuration[] = [];
  companies: configuration[] = [];
  originalAllItems: configuration[] = []


  get currentLang() {
    return this._TranslateService.currentLang
  }

  constructor(
    private kafilService: KafilService,
    private translate: TranslateService,
    private _FormBuilder: FormBuilder,
    private _TranslateService: TranslateService,
    private _spinner: NgxSpinnerService,
    private _toaster: ToastrService,
  ) {
    this.configurationForm = this._FormBuilder.group({
      kafilNameAr: ['', Validators.required],
      kafilNameEn: ['', Validators.required],
      idNumber: ['', Validators.required],
      mobile: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllkafils();
  }


  getAllkafils() {
    this.kafilService.getAllKafils().subscribe({
      next: (res) => {
        this.kafils = res.data
        this.kafils.forEach((obj: any) => obj.checked = false);
        this.originalAllItems = this.kafils
      },
      error: (err) => console.error(err)
    });
  }

  onSearchChange(): void {
    const value = this.settingForm.get('searchInput')?.value.toLowerCase() || '';
    console.log('value', value)
    if (!value) {
      this.kafils = this.originalAllItems
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
    this.kafils = [item]
    // You can emit or use the selected item here
  }

  filterClicked(item: any) {
    this.filterSelected = item
    this.kafils = this.originalAllItems
    this.settingForm.get('searchInput')?.setValue('');
  }

  groupBy(groupBy: string) {
    if (groupBy == 'id') {
      this.kafils = this.kafils.sort((a, b) => Number(a.id) - Number(b.id))
    } else {
      this.kafils = this.kafils.sort((a: any, b: any) => this.currentLang == 'ar' ? a.nameAr.localeCompare(b.nameAr) : a.nameEn.localeCompare(b.nameEn));
    }
  }

  addEdit() {
    this.submited = true;
    if (this.configurationForm.valid) {
      this._spinner.show('spinner2')
      if (this.addOrEdit == 'add') {
        this.kafilService.addKafil(this.configurationForm.value).subscribe({
          next: res => {
            this.wrongError = false
            this._spinner.hide('spinner2')
            console.log(res);
            if (res.success) {
              this._toaster.success(this.translate.instant('KAFILS.SuccessTitle'));
              this.textError = ''
              this.modalCloseBtn.nativeElement.click();
              this.getAllkafils();
            } else {
              this.textError = this.translate.instant('KAFILS.ErrorMessage')
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
          'kafilNameAr': this.configurationForm.value.kafilNameAr,
          'kafilNameEn': this.configurationForm.value.kafilNameEn,
          'idNumber': this.configurationForm.value.idNumber,
          'mobile': this.configurationForm.value.mobile,
        }
        this.kafilService.updateKafil(body).subscribe({
          next: (res) => {
            this.wrongError = false
            this._spinner.hide('spinner2')
            if (res.success) {
              this._toaster.success(this.translate.instant('KAFILS.updated'));
              this.textError = ''
              this.getAllkafils();
              this.modalCloseBtn.nativeElement.click();
            } else {
              this.textError = this.translate.instant('KAFILS.ErrorMessage2')
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
      kafilNameAr: item.nameAr,
      kafilNameEn: item.nameEn,
      idNumber: item.idNumber,
      mobile: item.mobile
    });
    this.id = item.id
    this.submited = false;
    this.wrongError = false;
  }

  confirmDelete(id: number) {
    Swal.fire({
      title: this.translate.instant('KAFILS.DeleteConfirmTitle'),
      text: this.translate.instant('KAFILS.DeleteConfirm'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('COMMON.YesDelete'),
      cancelButtonText: this.translate.instant('COMMON.Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.kafilService.deleteKafil(id.toString()).subscribe({
          next: (res) => {
            console.log(res);
            if (res.success) {
              this.getAllkafils();
              Swal.fire(
                this.translate.instant('COMMON.Deleted'),
                this.translate.instant('KAFILS.Success'),
                'success'
              );
            } else {
              Swal.fire(
                this.translate.instant('COMMON.Error'),
                this.translate.instant('KAFILS.Error'),
                'error'
              );
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire(
              this.translate.instant('COMMON.Error'),
              this.translate.instant('KAFILS.Error'),
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
      kafilNameAr: '',
      kafilNameEn: '',
      idNumber: '',
      mobile: ''
    });
    this.submited = false;
    this.wrongError = false
  }

  isAnyChecked() {
    return this.kafils.some((item: any) => item.checked);
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
  //           this.getAllkafils()
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
  //   let ids = this.kafils.filter((obj) => obj.checked).map(item => item.id)
  //   this.DeleteItem(ids)
  // }

}