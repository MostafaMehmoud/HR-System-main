import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  private baseUrl = `${environment.apiUrl}/api/City`;
  
    constructor(private _HttpClient: HttpClient) { }
  
    private setHeaders(): any {
      return {
        headers: {
          Authorization: localStorage.getItem('userToken') || ''
        }
      };
    }
  
    getAllCities(): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetAllCities`, {}, this.setHeaders());
    }
  
    getCityById(id: string): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetCityById?id=${id}`, {}, this.setHeaders());
    }
  
    addCity(data: any): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/AddCity`, data, this.setHeaders()).pipe(
        catchError((error) => {
          console.error('Error adding company:', error);
          return throwError(() => new Error('حدث خطأ أثناء إضافة الشركة. حاول مرة أخرى.'));
        })
      );
    }
    
    updateCity(data: any): Observable<any> {
      return this._HttpClient.put(`${this.baseUrl}/UpdateCity`, data, this.setHeaders());
    }
    deleteCity(id: string): Observable<any> {
      console.log(this.setHeaders());
      console.log("ID type:", typeof(id));  // هذا يطبع نوع الـ ID للتأكد من أنه String
      return this._HttpClient.delete(`${this.baseUrl}/DeleteCity?id=${id}`, this.setHeaders());
    }
    
    
    
}
