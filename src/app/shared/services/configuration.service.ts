import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import  {environment} from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  constructor(private _HttpClient: HttpClient) { }

  setHeadrs(): any {
    return { headers: { 'Authorization': localStorage.getItem('userToken') } }
  }


  addNewConfig(body: any): Observable<any> {
    return this._HttpClient.post('', body, this.setHeadrs())
  }


  deleteConfig(body: any): Observable<any> {
    return this._HttpClient.post('', body, this.setHeadrs())
  }
  

  editConfig(body: any): Observable<any> {
    return this._HttpClient.post('', body, this.setHeadrs())
  }


}
