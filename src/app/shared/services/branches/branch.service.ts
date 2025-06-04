import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private baseUrl = `${environment.apiUrl}/api/Branch`;
  
    constructor(private _HttpClient: HttpClient) { }
  
    private setHeaders(): any {
      return {
        headers: {
          Authorization: localStorage.getItem('userToken') || ''
        }
      };
    }
  
    getAllBranches(): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetAllBranches`, {}, this.setHeaders());
    }
  
    getBranchById(id: string): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetBranchById?id=${id}`, {}, this.setHeaders());
    }
  
    addBranch(data: any): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/AddBranch`, data, this.setHeaders()).pipe(
        catchError((error) => {
          console.error('Error adding company:', error);
          return throwError(() => new Error('حدث خطأ أثناء إضافة الشركة. حاول مرة أخرى.'));
        })
      );
    }
    
    updateBranch(data: any): Observable<any> {
      return this._HttpClient.put(`${this.baseUrl}/UpdateBranch`, data, this.setHeaders());
    }
    deleteBranch(id: string): Observable<any> {
      console.log(this.setHeaders());
      console.log("ID type:", typeof(id));  // هذا يطبع نوع الـ ID للتأكد من أنه String
      return this._HttpClient.delete(`${this.baseUrl}/DeleteBranch?id=${id}`, this.setHeaders());
    }
    
    
    
}
