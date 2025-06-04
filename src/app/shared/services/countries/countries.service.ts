
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl = `${environment.apiUrl}/api/Country`;
  
    constructor(private _HttpClient: HttpClient) { }
  
    private setHeaders(): any {
      return {
        headers: {
          Authorization: localStorage.getItem('userToken') || ''
        }
      };
    }
  
    getAllCountries(): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetAllCountries`, {}, this.setHeaders());
    }
  
    getCountryById(id: string): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/GetCountryById?id=${id}`, {}, this.setHeaders());
    }
  
    addCountry(data: any): Observable<any> {
      return this._HttpClient.post(`${this.baseUrl}/AddCountry`, data, this.setHeaders()).pipe(
        catchError((error) => {
          console.error('Error adding company:', error);
          return throwError(() => new Error('حدث خطأ أثناء إضافة الشركة. حاول مرة أخرى.'));
        })
      );
    }
    
    updateCountry(data: any): Observable<any> {
      return this._HttpClient.put(`${this.baseUrl}/UpdateCountry`, data, this.setHeaders());
    }
    deleteCountry(id: string): Observable<any> {
      console.log(this.setHeaders());
      console.log("ID type:", typeof(id));  // هذا يطبع نوع الـ ID للتأكد من أنه String
      return this._HttpClient.delete(`${this.baseUrl}/DeleteCountry?id=${id}`, this.setHeaders());
    }
    
    
    
}
