
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  private baseUrl = `${environment.apiUrl}/api/Department`;
  
    constructor(private _HttpClient: HttpClient) { }
  
    private setHeaders(): any {
      return {
        headers: {
          Authorization: localStorage.getItem('userToken') || ''
        }
      };
    }
  
    getAllDepartments(): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetAllDepartments`, {}, this.setHeaders());
    }
  
    getDepartmentById(id: string): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetDepartmentById?id=${id}`, {}, this.setHeaders());
    }
  
    addDepartment(data: any): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/AddDepartment`, data, this.setHeaders()).pipe(
        catchError((error) => {
          console.error('Error adding company:', error);
          return throwError(() => new Error('حدث خطأ أثناء إضافة الشركة. حاول مرة أخرى.'));
        })
      );
    }
    
    updateDepartment(data: any): Observable<any> {
      return this._HttpClient.put(`${this.baseUrl}/UpdateDepartment`, data, this.setHeaders());
    }
    deleteDepartment(id: string): Observable<any> {
      console.log(this.setHeaders());
      console.log("ID type:", typeof(id));  // هذا يطبع نوع الـ ID للتأكد من أنه String
      return this._HttpClient.delete(`${this.baseUrl}/DeleteDepartment?id=${id}`, this.setHeaders());
    }
    
    
    
}
