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
      return this.http.get<any>(`${this.apiUrl}/products`);
  }

  getProduct(productId: any): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/products/${productId}`);
  }

  getAllProductSizes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sizes`);
  }

  getProductSizes(productId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${productId}/sizes`);
  }

  getAllProductCategory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }

  getProductCategory(productId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${productId}/categories`);
  }
}
