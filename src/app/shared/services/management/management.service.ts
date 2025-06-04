import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  private baseUrl = `${environment.apiUrl}/api/Manage`;
  
    constructor(private _HttpClient: HttpClient) { }
  
    private setHeaders(): any {
      return {
        headers: {
          Authorization: localStorage.getItem('userToken') || ''
        }
      };
    }
  
    getAllManage(): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetAllManage`, {}, this.setHeaders());
    }
  
    getManageById(id: string): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetManageById?id=${id}`, {}, this.setHeaders());
    }
  
    addManage(data: any): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/AddManage`, data, this.setHeaders()).pipe(
        catchError((error) => {
          return throwError(() => new Error('حدث خطأ أثناء إضافة الشركة. حاول مرة أخرى.'));
        })
      );
    }
    
    updateManage(data: any): Observable<any> {
      return this._HttpClient.put(`${this.baseUrl}/UpdateManage`, data, this.setHeaders());
    }
    deleteManage(id: string): Observable<any> {
      console.log(this.setHeaders());
      console.log("ID type:", typeof(id));  // هذا يطبع نوع الـ ID للتأكد من أنه String
      return this._HttpClient.delete(`${this.baseUrl}/DeleteManage?id=${id}`, this.setHeaders());
    }
    
    
    
}
