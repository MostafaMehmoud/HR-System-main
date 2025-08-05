
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QualificationService {

  private baseUrl = `${environment.apiUrl}/api/College`;
  
    constructor(private _HttpClient: HttpClient) { }
  
    private setHeaders(): any {
      return {
        headers: {
          Authorization: localStorage.getItem('userToken') || ''
        }
      };
    }
  
    getAllQualifications(): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetAllColleges`, {}, this.setHeaders());
    }
  
    getQualificationById(id: string): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetCollegeById?id=${id}`, {}, this.setHeaders());
    }
  
    addQualification(data: any): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/AddCollege`, data, this.setHeaders()).pipe(
        catchError((error) => {
          return throwError(() => new Error('حدث خطأ أثناء إضافة الشركة. حاول مرة أخرى.'));
        })
      );
    }
    
    updateQualification(data: any): Observable<any> {
      return this._HttpClient.put(`${this.baseUrl}/UpdateCollege`, data, this.setHeaders());
    }
    deleteQualification(id: string): Observable<any> {
      console.log(this.setHeaders());
      console.log("ID type:", typeof(id));  // هذا يطبع نوع الـ ID للتأكد من أنه String
      return this._HttpClient.delete(`${this.baseUrl}/DeleteCollege?id=${id}`, this.setHeaders());
    }
    
    
    
}
