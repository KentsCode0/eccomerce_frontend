import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost/ecommerce-api/public/api';
  constructor(private http: HttpClient, private tokenService: TokenService) { }


  getAllProducts(): Observable<any> {
    const authInfo = this.tokenService.getAuth();
    if (authInfo) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${authInfo[0]}`
      });
      return this.http.get<any>(`${this.apiUrl}/products`, { headers: headers });
    } else {
      return throwError('Unauthorized access');
    }
  }
}
