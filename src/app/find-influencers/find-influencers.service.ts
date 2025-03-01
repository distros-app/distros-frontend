import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../core/model/common.model';
import { ApiEndpoint } from '../core/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class FindInfluencersService {
  //baseURL: string = "http://localhost:3000/api/influencers";
  baseURL: string = "https://distros-8f63ee867795.herokuapp.com/api/influencers";

  constructor(
    private HttpClient: HttpClient
  ) { }

  fetchAllInfluencers(query: any) {
    let queryParams: string = this.toQueryString(query);
    return this.HttpClient.get(`${this.baseURL}?${queryParams}`);
  }

  hideInfluencer(query: any) {
    return this.HttpClient.patch<ApiResponse<any>>(`${ApiEndpoint.Influencers.HideInfluencer}`,
      query
    );
  }

  unhideInfluencer(query: any) {
    return this.HttpClient.patch<ApiResponse<any>>(`${ApiEndpoint.Influencers.UnhideInfluencer}`,
      query
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
