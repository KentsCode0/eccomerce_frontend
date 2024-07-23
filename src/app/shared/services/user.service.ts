import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost/ecommerce-api/public/api';

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/token`, credentials, { responseType: "json" });
  }
  
  getUserInformation(): Observable<any> {
    const authInfo = this.tokenService.getAuth();
    if (authInfo) {
      const userId = authInfo[1];
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authInfo[0]}`
      });
      return this.http.get<any>(`${this.apiUrl}/users/${userId}`, { headers: headers });
    } else {
      return throwError('Unauthorized access');
    }
  }
}
