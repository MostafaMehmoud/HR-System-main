import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import  {environment} from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _HttpClient:HttpClient  ) { }

  setHeadrs(): any {
    return { headers: { 'Authorization': localStorage.getItem('userToken') } }
  }


  login( body:any ):Observable<any>{
    return this._HttpClient.post(`${environment.apiUrl}/Api/Auth/SignIn` , body )
  }



  logout():Observable<any>{
    return this._HttpClient.post(`${environment.apiUrl}/Api/Auth/SignOut` , "", this.setHeadrs() )
  }
}
