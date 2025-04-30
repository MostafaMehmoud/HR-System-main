import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import  {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class GetOrdersService {
  constructor(private _HttpClient: HttpClient) { }

  setHeadrs(): any {
    return { headers: { 'Authorization': localStorage.getItem('userToken') } }
  }

  setHeadrsFile(): any {
    return { headers: { 'Authorization': localStorage.getItem('userToken') }, responseType: 'blob' }
  }



  getAssetsOrders(): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/Employee/GetEmployeeCustodies`,  this.setHeadrs())
  }

  getLettersOrders(): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/Employee/GetEmployeeLetter`, this.setHeadrs())
  }

  getPermissionsOrders(): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/Employee/GetEmployeePermissions`, this.setHeadrs())
  }

  downloadFile(fileId: string): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/File/GetFile/${fileId}`, this.setHeadrsFile())
  }


}
