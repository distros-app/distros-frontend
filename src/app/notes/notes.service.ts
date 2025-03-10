import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, RegisterPayLoad } from '../core/model/common.model';
import { ApiEndpoint } from '../core/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  //baseURL: string = "http://localhost:3000/api/notes";
  baseURL: string = "https://distros-8f63ee867795.herokuapp.com/api/notes";

  constructor(private _http: HttpClient) { }

  fetchMyNotes(query: any) {
    let queryParams: string = this.toQueryString(query);
    return this._http.get(`${this.baseURL}?${queryParams}`);
  }

  createNewNote(payload: RegisterPayLoad) {
    return this._http.post<ApiResponse<any>>(`${ApiEndpoint.Notes.CreateNote}`,
        payload
    );
  }

  updateNote(query: any) {
    return this._http.put<ApiResponse<any>>(`${ApiEndpoint.Notes.UpdateNote}`,
        query
    );
  }

  deleteNote(query: any) {
    let queryParams: string = this.toQueryString(query);
    console.log(queryParams)
    return this._http.delete<ApiResponse<any>>(`${ApiEndpoint.Notes.DeleteNote}?${queryParams}`);
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
