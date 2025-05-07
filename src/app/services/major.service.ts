import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MajorService {
  private apiUrl = 'http://localhost:8096/api/';


  constructor(private http: HttpClient) { }

  getMajors( query: {filter: string, currentPage: number, perPage: number}): Observable<any> {
    const url = this.apiUrl + 'major/getMajor'
    const body = {
      major_name: query.filter,
      page: query.currentPage,
      pageSize: query.perPage
    };

    return this.http.post<any>(url, body);
  }
}
