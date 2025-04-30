import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private baseUrl = `${environment.apiUrl}/api/Company`;
  
    constructor(private _HttpClient: HttpClient) { }
  
    private setHeaders(): any {
      return {
        headers: {
          Authorization: localStorage.getItem('userToken') || ''
        }
      };
    }
  
    getAllCompanies(): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetAllCompanies`, {}, this.setHeaders());
    }
  
    getCompanyById(id: string): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetCompanyById?id=${id}`, {}, this.setHeaders());
    }
  
    addCompany(data: any): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/AddCompany`, data, this.setHeaders()).pipe(
        catchError((error) => {
          console.error('Error adding company:', error);
          return throwError(() => new Error('حدث خطأ أثناء إضافة الشركة. حاول مرة أخرى.'));
        })
      );
    }
    
    updateCompany(data: any): Observable<any> {
      return this._HttpClient.put(`${this.baseUrl}/UpdateCompany`, data, this.setHeaders());
    }
    deleteCompany(id: string): Observable<any> {
      console.log(this.setHeaders());
      console.log("ID type:", typeof(id));  // هذا يطبع نوع الـ ID للتأكد من أنه String
      return this._HttpClient.delete(`${this.baseUrl}/DeleteCompany?id=${id}`, this.setHeaders());
    }
    
    
    
}
