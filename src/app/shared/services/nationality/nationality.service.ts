import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NationalityService {

  private baseUrl = `${environment.apiUrl}/api/Nation`;
  
    constructor(private _HttpClient: HttpClient) { }
  
    private setHeaders(): any {
      return {
        headers: {
          Authorization: localStorage.getItem('userToken') || ''
        }
      };
    }
  
    getAllNation(): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetAllNations`, {}, this.setHeaders());
    }
  
    getNationById(id: string): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetNationById?id=${id}`, {}, this.setHeaders());
    }
  
    addNation(data: any): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/AddNation`, data, this.setHeaders()).pipe(
        catchError((error) => {
          return throwError(() => new Error('حدث خطأ أثناء إضافة الشركة. حاول مرة أخرى.'));
        })
      );
    }
    
    updateNation(data: any): Observable<any> {
      return this._HttpClient.put(`${this.baseUrl}/UpdateNation`, data, this.setHeaders());
    }
    deleteNation(id: string): Observable<any> {
      console.log(this.setHeaders());
      console.log("ID type:", typeof(id));  // هذا يطبع نوع الـ ID للتأكد من أنه String
      return this._HttpClient.delete(`${this.baseUrl}/DeleteNation?id=${id}`, this.setHeaders());
    }
    
    
    
}
