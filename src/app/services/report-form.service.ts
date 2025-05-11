import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportFormService {
  private apiUrl = 'http://localhost:8096/api/';

  constructor(private http: HttpClient) {}

  getFiles(params:{
    keyword: string,
    page: number,
    pageSize: number
  }): Observable<any> {
    const url = this.apiUrl + 'file/getFiles';
    // const body = {
    //   studentId: studentId || '',
    //   projectRoundId: projectRoundId || '',
    //   page: page,
    //   pageSize: pageSize,
    // };
    return this.http.post<any>(url, params);
  }
}
