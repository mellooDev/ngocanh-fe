import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:8096/api/';

  constructor(private http: HttpClient) {}

  createStudent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}student/createStudent`, data);
  }

  searchStudents(
    studentName: string,
    studentCode: string,
    classCode: string,
    status: string,
    page: number,
    pageSize: number
  ): Observable<any> {
    const body = {
      studentName: studentName || '',
      studentCode: studentCode || '',
      classCode: classCode || '',
      status: status || '',
      page: page,
      pageSize: pageSize,
    };

    return this.http.post<any>(`${this.apiUrl}student/getStudents`, body);
  }
}
