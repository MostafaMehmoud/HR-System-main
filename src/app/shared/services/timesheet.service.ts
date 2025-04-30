import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import  {environment} from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  constructor(private _HttpClient: HttpClient, private _Router: Router) { }

  setHeadrs(): any {
    return { headers: { 'Authorization': localStorage.getItem('userToken') } }
  }

  getBasicData(): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/Employee/GetBasicAdvancePaymentInfo`, this.setHeadrs())
  }


  sendData(body: any): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Api/EmployeeAttendance/InsertEmployeeAttendance`, body, this.setHeadrs())
  }

  getData(body: any): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Api/EmployeeAttendance/GetEmployeeAttendance`, body, this.setHeadrs())
  }

  getNamebyId(id: string): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/General/GetEmployeeName?EmployeeId=${id}`,
      { ...this.setHeadrs(), responseType: 'text' })
  }

}
