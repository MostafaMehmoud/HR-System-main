import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { company } from 'src/app/shared/interfaces/config';
import { CompanyService } from 'src/app/shared/services/company.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = 5;
  
  companies: company[] = [];
  openAddCompanyModal(): void {
    // هنا ممكن تفتح مودال أو تغير قيمة تظهر المودال
    console.log("فتح مودال إضافة شركة جديدة");
  }
  constructor(private companyService: CompanyService,private translate: TranslateService) {}

  ngOnInit(): void {
    this.getAllCompanies();
  }

  getAllCompanies() {
    this.companyService.getAllCompanies().subscribe({
      next: (res) =>{ this.companies = res.data 
      console.log(this.companies)},
      error: (err) => console.error(err)
    });
  }

  openAddModal() {
    // فتح مودال للإضافة
  }

  editCompany(company: company) {
    // فتح مودال للتعديل
  }

 
  confirmDelete(id: number) {
    Swal.fire({
      title: this.translate.instant('COMPANIES.DeleteConfirmTitle'),
      text: this.translate.instant('COMPANIES.DeleteConfirm'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('COMMON.YesDelete'),
      cancelButtonText: this.translate.instant('COMMON.Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.companyService.deleteCompany(id.toString()).subscribe({
          next: (res) => {
            console.log(res);
            if (res.success) {
              this.getAllCompanies();
              Swal.fire(
                this.translate.instant('COMMON.Deleted'),
                 this.translate.instant('COMPANIES.Success'),
                'success'
              );
            } else {
              Swal.fire(
                this.translate.instant('COMMON.Error'),
                this.translate.instant('COMPANIES.Error'),
                'error'
              );
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire(
              this.translate.instant('COMMON.Error'),
              this.translate.instant('COMPANIES.Error'),
              'error'
            );
          }
        });
      }
    });
  }
  
  
}