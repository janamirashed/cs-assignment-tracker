import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProgressService {
    private apiUrl = 'http://localhost:8080/api/progress';

    constructor(private http: HttpClient) { }

    toggleCompletion(userId: number, assignmentId: number): Observable<{ completed: boolean }> {
        // using POST with query params to match the @RequestParam in our Spring Controller
        return this.http.post<{ completed: boolean }>(
            `${this.apiUrl}/toggle?userId=${userId}&assignmentId=${assignmentId}`,
            {}
        );
    }

    getStats(userId: number): Observable<{ completed: number; total: number }> {
        return this.http.get<{ completed: number; total: number }>(`${this.apiUrl}/stats/${userId}`);
    }
}
