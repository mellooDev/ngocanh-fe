import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoundSessionService {
  private apiUrl = 'http://localhost:8096/api/';

  constructor(private http: HttpClient) {}

  // createStudent(data: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}student/createStudent`, data);
  // }

  searchRound(
    sessionName: string,
    roundNumber: number,
    page: number,
    pageSize: number
  ): Observable<any> {
    const body = {
      sessionName: sessionName || '',
      roundNumber: roundNumber || '',
      page: page,
      pageSize: pageSize,
    };

    return this.http.post<any>(`${this.apiUrl}round/getRound`, body);
  }

  getRoundStudent(
    roundId: string,
    page: number,
    pageSize: number
  ): Observable<any> {
    const body = {
      roundId: roundId,
      page: page,
      pageSize: pageSize,
    };

    return this.http.post<any>(`${this.apiUrl}round/getRoundStudent`, body);
  }

  addStudent(roundId: string, students: any[]): Observable<any> {
    const url = `${this.apiUrl}round/addStudent`
    const body = {
      roundId: roundId,
      students: students
    };

    return this.http.post<any>(url, body);
  }
}
