import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private baseUrl = `${environment.apiUrl}/api/Job`;
  
    constructor(private _HttpClient: HttpClient) { }
  
    private setHeaders(): any {
      return {
        headers: {
          Authorization: localStorage.getItem('userToken') || ''
        }
      };
    }
  
    getAllJobs(): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetAllJobs`, {}, this.setHeaders());
    }
  
    getJobById(id: string): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetJobById?id=${id}`, {}, this.setHeaders());
    }
  
    addJob(data: any): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/AddJob`, data, this.setHeaders()).pipe(
        catchError((error) => {
          return throwError(() => new Error('حدث خطأ أثناء إضافة الشركة. حاول مرة أخرى.'));
        })
      );
    }
    
    updateJob(data: any): Observable<any> {
      return this._HttpClient.put(`${this.baseUrl}/UpdateJob`, data, this.setHeaders());
    }
    deleteJob(id: string): Observable<any> {
      console.log(this.setHeaders());
      console.log("ID type:", typeof(id));  // هذا يطبع نوع الـ ID للتأكد من أنه String
      return this._HttpClient.delete(`${this.baseUrl}/DeleteJob?id=${id}`, this.setHeaders());
    }
    
    
    
}
