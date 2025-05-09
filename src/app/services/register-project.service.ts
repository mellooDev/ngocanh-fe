import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterProjectService {
  private apiUrl = 'http://localhost:8096/api/';

  constructor(private http: HttpClient) {}

  getProjectForStudent(
    studentId: string,
    projectRoundId: string,
    page: number,
    pageSize: number
  ): Observable<any> {
    const url = this.apiUrl + 'register-project/getProjectForStudent';
    const body = {
      studentId: studentId || '',
      projectRoundId: projectRoundId || '',
      page: page,
      pageSize: pageSize,
    };
    return this.http.post<any>(url, body);
  }

  searchStudentRound(studentId: string): Observable<any> {
    const url = this.apiUrl + 'register-project/searchStudentRound';
    const body = {
      studentId: studentId,
    };
    return this.http.post<any>(url, body);
  }

  studentRegisProject(projectId: string, studentId: string): Observable<any> {
    const url = this.apiUrl + 'register-project/studentRegister';
    const body = {
      projectId: projectId,
      studentId: studentId,
    };
    return this.http.post<any>(url, body);
  }

  studentPurposeProject(
    projectId: string,
    projectName: string,
    description: string,
    projectRoundId: string,
    studentId: string,
    lecturerId: string,
    defenseMode: string
  ): Observable<any> {
    const url = this.apiUrl + 'register-project/studentPurposeProject';
    const body = {
      projectId: projectId,
      projectName: projectName,
      description: description,
      projectRoundId: projectRoundId,
      studentId: studentId,
      lecturerId: lecturerId,
      defenseMode: defenseMode,
    };
    return this.http.post<any>(url, body);
  }

  getLecturerInRound(
    projectRoundId: string,
  ): Observable<any> {
    const url = this.apiUrl + 'register-project/getLecturerInRound';
    const body = {
      projectRoundId: projectRoundId
    };
    return this.http.post<any>(url, body);
  }
}
