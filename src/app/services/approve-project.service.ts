import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApproveProjectService {
  private apiUrl = 'http://localhost:8096/api/';

  constructor(private http: HttpClient) {}

  getPendingProjectForLecturer(
    projectRoundId: string,
    lecturerId: string,
    page: number,
    pageSize: number
  ): Observable<any> {
    const url = this.apiUrl + 'approve-project/getPendingLecturerProject';
    const body = {
      projectRoundId: projectRoundId || '',
      lecturerId: lecturerId || '',
      page: page,
      pageSize: pageSize,
    };
    return this.http.post<any>(url, body);
  }

  searchLecturerRound(
    lecturerId: string,
  ): Observable<any> {
    const url = this.apiUrl + 'approve-project/searchLecturerRound';
    const body = {
      lecturerId: lecturerId || '',
    };
    return this.http.post<any>(url, body);
  }

  lecturerApproveProject(
    projectRequestId: string,
  ): Observable<any> {
    const url = this.apiUrl + 'approve-project/lecturerApproveProject';
    const body = {
      projectRequestId: projectRequestId,
    };
    return this.http.post<any>(url, body);
  }

}
