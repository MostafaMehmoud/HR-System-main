import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NeighborService {

  private baseUrl = `${environment.apiUrl}/api/Neighbor`;
  
    constructor(private _HttpClient: HttpClient) { }
  
    private setHeaders(): any {
      return {
        headers: {
          Authorization: localStorage.getItem('userToken') || ''
        }
      };
    }
  
    getAllNeighbor(): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetAllNeighbors`, {}, this.setHeaders());
    }
  
    getNeighborById(id: string): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetNeighborById?id=${id}`, {}, this.setHeaders());
    }
  
    addNeighbor(data: any): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/AddNeighbor`, data, this.setHeaders()).pipe(
        catchError((error) => {
          return throwError(() => new Error('حدث خطأ أثناء إضافة الشركة. حاول مرة أخرى.'));
        })
      );
    }
    
    updateNeighbor(data: any): Observable<any> {
      return this._HttpClient.put(`${this.baseUrl}/UpdateNeighbor`, data, this.setHeaders());
    }
    deleteNeighbor(id: string): Observable<any> {
      console.log(this.setHeaders());
      console.log("ID type:", typeof(id));  // هذا يطبع نوع الـ ID للتأكد من أنه String
      return this._HttpClient.delete(`${this.baseUrl}/DeleteNeighbor?id=${id}`, this.setHeaders());
    }
    
    
    
}
