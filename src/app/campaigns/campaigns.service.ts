import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, RegisterPayLoad } from '../core/model/common.model';
import { ApiEndpoint } from '../core/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class CampaignsService {
  baseURL: string = "http://localhost:3000/api/campaigns";

  constructor(private _http: HttpClient) { }

  fetchMyCampaigns(query: RegisterPayLoad) {
    let queryParams: string = this.toQueryString(query);
    return this._http.get(`${this.baseURL}?${queryParams}`);
  }

  createCampaign(payload: RegisterPayLoad) {
    return this._http.post<ApiResponse<any>>(`${ApiEndpoint.Campaigns.CreateCampaign}`,
        payload
    );
  }

 deleteCampaign(query: any) {
    let queryParams: string = this.toQueryString(query);
    return this._http.delete<ApiResponse<any>>(`${ApiEndpoint.Campaigns.DeleteCampaign}?${queryParams}`);
  }

  updateCampaign(query: any) {
    console.log('payload:', query)
    return this._http.patch<ApiResponse<any>>(`${ApiEndpoint.Campaigns.UpdateCampaign}`,
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
