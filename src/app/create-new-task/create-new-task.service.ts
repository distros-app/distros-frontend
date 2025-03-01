import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, RegisterPayLoad } from '../core/model/common.model';
import { ApiEndpoint } from '../core/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class CreateTaskService {
  //baseURL: string = "http://localhost:3000/api/tasks";
  baseURL: string = "https://distros-8f63ee867795.herokuapp.com/api/tasks";

  constructor(private _http: HttpClient) { }

  fetchMyTasks(query: any) {
    let queryParams: string = this.toQueryString(query);
    return this._http.get(`${this.baseURL}?${queryParams}`);
  }

  createNewTask(payload: RegisterPayLoad) {
    return this._http.post<ApiResponse<any>>(`${ApiEndpoint.Tasks.CreateTask}`,
        payload
    );
  }

  updateTask(query: any) {
    console.log('payload:', query)
    return this._http.patch<ApiResponse<any>>(`${ApiEndpoint.Tasks.UpdateTask}`,
        query
    );
  }

  editTask(payload: RegisterPayLoad) {
    console.log('payload:', payload)
    return this._http.patch<ApiResponse<any>>(`${ApiEndpoint.Tasks.EditTask}`,
        payload
    );
  }

  deleteTask(query: any) {
    let queryParams: string = this.toQueryString(query);
    return this._http.delete<ApiResponse<any>>(`${ApiEndpoint.Tasks.DeleteTask}?${queryParams}`);
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
