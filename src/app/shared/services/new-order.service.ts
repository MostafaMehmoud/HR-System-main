import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import  {environment} from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class NewOrderService {

  constructor(private _HttpClient: HttpClient) { }

  setHeadrs(): any {
    return { headers: { 'Authorization': localStorage.getItem('userToken') } }
  }


  requestpermission(body:any): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Api/Employee/RequestPermission`, body, this.setHeadrs())
  }


  requestletter(body:any): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Api/Employee/RequestLetter`, body, this.setHeadrs())
  }

  requestasset(body:any): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Api/Employee/RequestCustody`, body, this.setHeadrs())
  }

}
