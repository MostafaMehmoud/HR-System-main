import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { configuration } from 'src/app/shared/interfaces/config';
import { CountriesService } from 'src/app/shared/services/countries/countries.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css' , '../../shared/configration.css']
})

export class CountriesComponent implements OnInit {
  configurationName = 'Dashboard.بلد'
  NameAr = 'nameArCountry'
  NameEn = 'nameEnCountry'

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

  countries: configuration[] = [];
  originalAllItems: configuration[] = []


  get currentLang() {
    return this._TranslateService.currentLang
  }

  constructor(
    private countriesService: CountriesService,
    private translate: TranslateService,
    private _FormBuilder: FormBuilder,
    private _TranslateService: TranslateService,
    private _spinner: NgxSpinnerService,
    private _toaster: ToastrService,
  ) {
    this.configurationForm = this._FormBuilder.group({
      nameArCountry: ['', Validators.required],
      nameEnCountry: ['', Validators.required],
      vatValue: ['', [Validators.required , Validators.pattern(/^\d*\.?\d+$/)]],
      currency: ['', Validators.required],
      exchangeRate: ['', [Validators.required , Validators.pattern(/^\d*\.?\d+$/)]],
      currencyId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllcountries();
  }


  getAllcountries() {
    this.countriesService.getAllCountries().subscribe({
      next: (res) => {
        this.countries = res.data
        this.countries.forEach((obj: any) => obj.checked = false);
        this.originalAllItems = this.countries
      },
      error: (err) => console.error(err)
    });
  }

  onSearchChange(): void {
    const value = this.settingForm.get('searchInput')?.value.toLowerCase() || '';
    console.log('value', value)
    if (!value) {
      this.countries = this.originalAllItems
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
    this.countries = [item]
    // You can emit or use the selected item here
  }

  filterClicked(item: any) {
    this.filterSelected = item
    this.countries = this.originalAllItems
    this.settingForm.get('searchInput')?.setValue('');
  }

  groupBy(groupBy: string) {
    if (groupBy == 'id') {
      this.countries = this.countries.sort((a, b) => Number(a.id) - Number(b.id))
    } else {
      this.countries = this.countries.sort((a: any, b: any) => this.currentLang == 'ar' ? a.nameAr.localeCompare(b.nameAr) : a.nameEn.localeCompare(b.nameEn));
    }
  }

  addEdit() {
    this.submited = true;
    if (this.configurationForm.valid) {
      this._spinner.show('spinner2')
      if (this.addOrEdit == 'add') {
        this.countriesService.addCountry(this.configurationForm.value).subscribe({
          next: res => {
            this.wrongError = false
            this._spinner.hide('spinner2')
            console.log(res);
            if (res.success) {
              this._toaster.success(this.translate.instant('COUNTRIES.SuccessTitle'));
              this.textError = ''
              this.modalCloseBtn.nativeElement.click();
              this.getAllcountries();
            } else {
              this.textError = this.translate.instant('COUNTRIES.ErrorMessage')
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
          'nameArCountry': this.configurationForm.value.nameArCountry,
          'nameEnCountry': this.configurationForm.value.nameEnCountry,
          'vatValue': this.configurationForm.value.vatValue,
          'currency': this.configurationForm.value.currency,
          'exchangeRate': this.configurationForm.value.exchangeRate,
          'currencyId': this.configurationForm.value.currencyId,
        }
        this.countriesService.updateCountry(body).subscribe({
          next: (res) => {
            this.wrongError = false
            this._spinner.hide('spinner2')
            if (res.success) {
              this._toaster.success(this.translate.instant('COUNTRIES.updated'));
              this.textError = ''
              this.getAllcountries();
              this.modalCloseBtn.nativeElement.click();
            } else {
              this.textError = this.translate.instant('COUNTRIES.ErrorMessage2')
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
      nameArCountry: item.nameAr,
      nameEnCountry: item.nameEn,
      currency: item.currency,
      currencyId: item.currencyId,
      vatValue: item.vatValue,
      exchangeRate: item.exchangeRate
    });
    this.id = item.id
    this.submited = false;
    this.wrongError = false;
  }

  confirmDelete(id: number) {
    Swal.fire({
      title: this.translate.instant('COUNTRIES.DeleteConfirmTitle'),
      text: this.translate.instant('COUNTRIES.DeleteConfirm'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('COMMON.YesDelete'),
      cancelButtonText: this.translate.instant('COMMON.Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.countriesService.deleteCountry(id.toString()).subscribe({
          next: (res) => {
            console.log(res);
            if (res.success) {
              this.getAllcountries();
              Swal.fire(
                this.translate.instant('COMMON.Deleted'),
                this.translate.instant('COUNTRIES.Success'),
                'success'
              );
            } else {
              Swal.fire(
                this.translate.instant('COMMON.Error'),
                this.translate.instant('COUNTRIES.Error'),
                'error'
              );
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire(
              this.translate.instant('COMMON.Error'),
              this.translate.instant('COUNTRIES.Error'),
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
      nameArCountry: '',
      nameEnCountry: '',
      currency: '',
      currencyId: '',
      vatValue: '',
      exchangeRate: ''
    });
    this.submited = false;
    this.wrongError = false
  }

  isAnyChecked() {
    return this.countries.some((item: any) => item.checked);
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
  //           this.getAllcountries()
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
  //   let ids = this.countries.filter((obj) => obj.checked).map(item => item.id)
  //   this.DeleteItem(ids)
  // }

allowOnlyNumbers(event: KeyboardEvent, inputValue: string) {
  const key = event.key;

  // Allow control keys (navigation, backspace, etc.)
  if (
    key === 'Backspace' || key === 'Tab' || key === 'ArrowLeft' ||
    key === 'ArrowRight' || key === 'Delete' || key === 'Home' || key === 'End'
  ) {
    return;
  }

  // Allow digits
  if (/^\d$/.test(key)) {
    return;
  }

  // Allow one decimal point if not already present
  if (key === '.' && !inputValue.includes('.')) {
    return;
  }

  // Block all other keys
  event.preventDefault();
}


}