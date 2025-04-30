import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import  {environment} from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private _HttpClient: HttpClient, private _Router: Router) { }


  setHeadrs(): any {
    return { headers: { 'Authorization': localStorage.getItem('userToken') } }
  }

  getBasicData(): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/Employee/GetBasicJobMissionInfo`, this.setHeadrs())
  }


  requestJobMission(body: any): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Api/Employee/RequestJobMission`, body, this.setHeadrs())
  }

  getAdminRequests(name: string = ``, abroveStatus: string = ``): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/Admin/GetAdminRequestJobMissions?Search=${name}&ApproveStatus=${abroveStatus}`, this.setHeadrs())
  }

  sendResponse(body: any): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Api/Admin/DecisionOfJobMission`, body, this.setHeadrs())
  }

  getAllEmpTasks(): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/Employee/GetEmployeeJobMissions`, this.setHeadrs())
  }
}
