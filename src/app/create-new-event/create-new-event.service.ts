import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, RegisterPayLoad } from '../core/model/common.model';
import { ApiEndpoint } from '../core/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  baseURL: string = "http://localhost:3000/api/events";

  constructor(private _http: HttpClient) { }

  fetchMyEvents(query: any) {
    console.log('query:', query)
    let queryParams: string = this.toQueryString(query);
    return this._http.get(`${this.baseURL}?${queryParams}`);
  }

  createEvent(payload: RegisterPayLoad) {
    return this._http.post<ApiResponse<any>>(`${ApiEndpoint.Events.CreateEvent}`,
        payload
    );
  }

 deleteEvent(query: any) {
    let queryParams: string = this.toQueryString(query);
    return this._http.delete<ApiResponse<any>>(`${ApiEndpoint.Events.DeleteEvent}?${queryParams}`);
  }

  updateEvent(query: any) {
    console.log('payload:', query)
    return this._http.patch<ApiResponse<any>>(`${ApiEndpoint.Events.UpdateEvent}`,
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