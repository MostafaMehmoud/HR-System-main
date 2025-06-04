import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReligionsService {

  private baseUrl = `${environment.apiUrl}/api/Religion`;
  
    constructor(private _HttpClient: HttpClient) { }
  
    private setHeaders(): any {
      return {
        headers: {
          Authorization: localStorage.getItem('userToken') || ''
        }
      };
    }
  
    getAllReligion(): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetAllReligions`, {}, this.setHeaders());
    }
  
    getReligionById(id: string): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetReligionById?id=${id}`, {}, this.setHeaders());
    }
  
    addReligion(data: any): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/AddReligion`, data, this.setHeaders()).pipe(
        catchError((error) => {
          return throwError(() => new Error('حدث خطأ أثناء إضافة الشركة. حاول مرة أخرى.'));
        })
      );
    }
    
    updateReligion(data: any): Observable<any> {
      return this._HttpClient.put(`${this.baseUrl}/UpdateReligion`, data, this.setHeaders());
    }
    deleteReligion(id: string): Observable<any> {
      console.log(this.setHeaders());
      console.log("ID type:", typeof(id));  // هذا يطبع نوع الـ ID للتأكد من أنه String
      return this._HttpClient.delete(`${this.baseUrl}/DeleteReligion?id=${id}`, this.setHeaders());
    }
    
    
    
}
