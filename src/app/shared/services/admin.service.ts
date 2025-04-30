import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import  {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private _HttpClient: HttpClient, private _Router: Router) { }
  

  setHeadrs(): any {
    return { headers: { 'Authorization': localStorage.getItem('userToken') } }
  }


  getAllRequestLoan(userId: any = ''): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/Admin/GetPindingAdvancePayments?Search=${userId}`)
  }

  getAllRequestVacation(userId: any = ''): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/Admin/GetPindingRequestVacations?Search=${userId}`)
  }

  getAllAssets(userId: any = ''): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/Admin/GetPindingRequestCustodies?Search=${userId}`)
  }
  getAllLetters(userId: any = ''): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/Admin/GetPindingRequestLetters?Search=${userId}`)
  }
  getAllPermissions(userId: any = ''): Observable<any> {
    return this._HttpClient.get(`${environment.apiUrl}/Api/Admin/GetPindingRequestPermissions?Search=${userId}`)
  }

  LoanAction(orderId: number, Action: boolean): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Api/Admin/DecisionOfAdvancePayment`,
      {
        "id": orderId,
        "accepted": Action
      },
      )
  }

  vacationAction(orderId: number, action: boolean, details: string): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Api/Admin/DecisionOfVacation`,
      {
        id: orderId,
        accepted: action,
        note: details
      }
    )
  }

  AssetsAction(orderId: number, action: boolean, details: string): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Api/Admin/DecisionOfCustody`,
      {
        id: orderId,
        accepted: action,
        note: details
      }
    )
  }

  LettersAction(orderId: number, action: boolean, details: string): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Api/Admin/DecisionOfLetter`,
      {
        id: orderId,
        accepted: action,
        note: details
      }
    )
  }

  PermissionsAction(orderId: number, action: boolean, details: string): Observable<any> {
    return this._HttpClient.post(`${environment.apiUrl}/Api/Admin/DecisionOfPermission`,
      {
        id: orderId,
        accepted: action,
        note: details
      }
    )
  }

}
