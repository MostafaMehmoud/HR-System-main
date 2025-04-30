import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CompanyService } from 'src/app/shared/services/company.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent {
  companyForm: FormGroup;
  dir: string = 'rtl';

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private translate: TranslateService,
     private router: Router // Inject Router
  ) {
    this.companyForm = this.fb.group({
      CompanyNameAr: ['', Validators.required],  // تغيير الاسم هنا
      CompanyNameEn: ['', Validators.required]   // تغيير الاسم هنا
    });
    this.translate.onLangChange.subscribe(lang => {
      this.dir = lang.lang === 'ar' ? 'rtl' : 'ltr';
    });
  }

  onSubmit() {
    if (this.companyForm.valid) {
      this.companyService.addCompany(this.companyForm.value).subscribe({
        next: res => {
          console.log(res);
          if (res.success) {
            // Success from API
            Swal.fire({
              title: this.translate.instant('COMPANIES.SuccessTitle'),
              text: this.translate.instant('COMPANIES.SuccessMessage'),
              icon: 'success',
              confirmButtonText: this.translate.instant('COMPANIES.Ok')
            }).then(() => {
              this.companyForm.reset();
              this.router.navigate(['/configuration/companies']);
            });
          } else {
            // API returned Success = false
            Swal.fire({
              title: this.translate.instant('COMPANIES.ErrorTitle'),
              text: res.message || this.translate.instant('COMPANIES.ErrorMessage'),
              icon: 'error',
              confirmButtonText: this.translate.instant('COMPANIES.Ok')
            });
          }
        },
        error: err => {
          console.log(err);
          Swal.fire({
            title: this.translate.instant('COMPANIES.ErrorTitle'),
            text: this.translate.instant('COMPANIES.ErrorMessage'),
            icon: 'error',
            confirmButtonText: this.translate.instant('COMPANIES.Ok')
          });
        }
      });
    } else {
      Swal.fire({
        title: this.translate.instant('COMPANIES.FormInvalid'),
        text: this.translate.instant('COMPANIES.FillRequiredFields'),
        icon: 'warning',
        confirmButtonText: this.translate.instant('COMPANIES.Ok')
      });
    }
  }
  
}
