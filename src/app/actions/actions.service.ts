import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, RegisterPayLoad } from '../core/model/common.model';
import { ApiEndpoint } from '../core/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  //baseURL: string = "http://localhost:3000/api/actions";
  baseURL: string = "https://distros-8f63ee867795.herokuapp.com/api/actions";

  constructor(private _http: HttpClient) { }

  createNote(payload: RegisterPayLoad) {
    console.log(payload)
    return this._http.post<ApiResponse<any>>(`${ApiEndpoint.Actions.CreateNote}`,
        payload
    );
  }


  toQueryString(paramsObject: any): string {
    let result: string = '';

    if (paramsObject) {
      result = Object
        .keys(paramsObject)
        .map((key: string) => {
          if(Array.isArray(paramsObject[key])) {
            return paramsObject[key].map((innerKey: string) => `${encodeURIComponent(key)}=${encodeURIComponent(innerKey)}`)
              .join('&');
          } else {
            return `${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`;
          }
        })
        .join('&');
    }

    return result;
  }
}
