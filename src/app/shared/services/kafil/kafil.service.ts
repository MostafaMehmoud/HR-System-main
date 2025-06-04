import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KafilService {

  private baseUrl = `${environment.apiUrl}/api/Kafil`;
  
    constructor(private _HttpClient: HttpClient) { }
  
    private setHeaders(): any {
      return {
        headers: {
          Authorization: localStorage.getItem('userToken') || ''
        }
      };
    }
  
    getAllKafils(): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetAllKafils`, {}, this.setHeaders());
    }
  
    getKafilById(id: string): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetKafilById?id=${id}`, {}, this.setHeaders());
    }
  
    addKafil(data: any): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/AddKafil`, data, this.setHeaders()).pipe(
        catchError((error) => {
          console.error('Error adding company:', error);
          return throwError(() => new Error('حدث خطأ أثناء إضافة الشركة. حاول مرة أخرى.'));
        })
      );
    }
    
    updateKafil(data: any): Observable<any> {
      return this._HttpClient.put(`${this.baseUrl}/UpdateKafil`, data, this.setHeaders());
    }
    deleteKafil(id: string): Observable<any> {
      console.log(this.setHeaders());
      console.log("ID type:", typeof(id));  // هذا يطبع نوع الـ ID للتأكد من أنه String
      return this._HttpClient.delete(`${this.baseUrl}/DeleteKafil?id=${id}`, this.setHeaders());
    }
    
    
    
}
