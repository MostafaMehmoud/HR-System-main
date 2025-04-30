import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import  {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MyProfileService {

  constructor(private _HttpClient: HttpClient, private _router: Router) { }

  srcData: BehaviorSubject<any> = new BehaviorSubject(null)

  setHeadrs(): any {
    return { headers: { 'Authorization': localStorage.getItem('userToken') }  }
  }

  getProfileDetails(): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/Employee/GetEmployeeDetailsInfo`, this.setHeadrs())
  }

  updateImg( body:any ): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Api/Employee/UploadEmployeeImage`, body , this.setHeadrs())
  }

}
