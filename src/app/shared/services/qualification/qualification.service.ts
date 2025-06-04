
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QualificationService {

  private baseUrl = `${environment.apiUrl}/api/Qualification`;
  
    constructor(private _HttpClient: HttpClient) { }
  
    private setHeaders(): any {
      return {
        headers: {
          Authorization: localStorage.getItem('userToken') || ''
        }
      };
    }
  
    getAllQualification(): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetAllQualifications`, {}, this.setHeaders());
    }
  
    getQualificationById(id: string): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetQualificationById?id=${id}`, {}, this.setHeaders());
    }
  
    addQualification(data: any): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/AddQualification`, data, this.setHeaders()).pipe(
        catchError((error) => {
          return throwError(() => new Error('حدث خطأ أثناء إضافة الشركة. حاول مرة أخرى.'));
        })
      );
    }
    
    updateQualification(data: any): Observable<any> {
      return this._HttpClient.put(`${this.baseUrl}/UpdateQualification`, data, this.setHeaders());
    }
    deleteQualification(id: string): Observable<any> {
      console.log(this.setHeaders());
      console.log("ID type:", typeof(id));  // هذا يطبع نوع الـ ID للتأكد من أنه String
      return this._HttpClient.delete(`${this.baseUrl}/DeleteQualification?id=${id}`, this.setHeaders());
    }
    
    
    
}
