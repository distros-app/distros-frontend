import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'
  //private apiUrl = 'https://distros-8f63ee867795.herokuapp.com';

  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get(`${this.apiUrl}/`);
  }
}