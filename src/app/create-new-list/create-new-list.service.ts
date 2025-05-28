import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, RegisterPayLoad } from '../core/model/common.model';
import { ApiEndpoint } from '../core/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class CreateListService {
  //baseURL: string = "http://localhost:3000/api/lists";
  baseURL: string = "https://distros-8f63ee867795.herokuapp.com/api/lists";

  constructor(private _http: HttpClient) { }

  fetchMyInfluencerLists(query: any) {
    let queryParams: string = this.toQueryString(query);
    return this._http.get(`${this.baseURL}?${queryParams}`);
  }

  createNewList(payload: RegisterPayLoad) {
    return this._http.post<ApiResponse<any>>(`${ApiEndpoint.Lists.CreateList}`,
        payload
    );
  }

  updateList(payload: RegisterPayLoad) {
    return this._http.patch<ApiResponse<any>>(`${ApiEndpoint.Lists.UpdateList}`,
        payload
    );
  }

  deleteInfluencerFromList(query: any) {
    let queryParams: string = this.toQueryString(query);
    return this._http.delete<ApiResponse<any>>(`${ApiEndpoint.Lists.DeleteInfluencerFromList}?${queryParams}`);
  }

  deleteList(query: any) {
    let queryParams: string = this.toQueryString(query);
    return this._http.delete<ApiResponse<any>>(`${ApiEndpoint.Lists.DeleteList}?${queryParams}`);
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
