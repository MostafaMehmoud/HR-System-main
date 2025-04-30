import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CompanyService } from 'src/app/shared/services/company.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {
  companyForm: FormGroup;
  companyId!: string;
  dir: string = 'rtl';
  id!: string;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private translate: TranslateService
  ) {
    this.companyForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required]
    });

    this.translate.onLangChange.subscribe(lang => {
      this.dir = lang.lang === 'ar' ? 'rtl' : 'ltr';
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    
    this.companyForm = this.fb.group({
      CompanyNameAr: ['', Validators.required],
      CompanyNameEn: ['', Validators.required]
    });

    this.getCompanyData();
  }

  getCompanyData() {
    this.companyService.getCompanyById(this.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Assuming the response structure is { success: boolean, data: Company }
          this.companyForm.patchValue({
            CompanyNameAr: response.data.nameAr, // Adjust if necessary based on your response
            CompanyNameEn: response.data.nameEn  // Adjust if necessary based on your response
          });
        } else {
          console.error('Failed to retrieve company data:', response.message);
          // Optionally show an error message if data fetching failed
        }
      },
      error: (err) => {
        console.error('Error occurred while fetching company data:', err);
        // Optionally handle API errors (like show a toast or error message)
      }
    });
  }
  

 onSubmit() {
  if (this.companyForm.valid) {
    const updatedCompany = {
      id: this.id, // تضمين معرّف الشركة
      companyNameAr: this.companyForm.value.CompanyNameAr,
      companyNameEn: this.companyForm.value.CompanyNameEn
    };

    this.companyService.updateCompany( updatedCompany).subscribe({
      next: (res) => {
        if (res.success) {
          Swal.fire({
            title: this.translate.instant('COMPANIES.SuccessTitle'),
            text: this.translate.instant('COMPANIES.SuccessMessage'),
            icon: 'success',
            confirmButtonText: this.translate.instant('COMPANIES.Ok')
          }).then(() => {
            this.router.navigate(['/configuration/companies']);
          });
        } else {
          Swal.fire({
            title: this.translate.instant('COMPANIES.ErrorTitle'),
            text: res.message || this.translate.instant('COMPANIES.ErrorMessage'),
            icon: 'error',
            confirmButtonText: this.translate.instant('COMPANIES.Ok')
          });
        }
      },
      error: (err) => {
        console.error('Error updating company', err);
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