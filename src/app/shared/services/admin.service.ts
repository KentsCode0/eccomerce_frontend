import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost/ecommerce-api/public/api';

  constructor(private http: HttpClient) { }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/products`, product);
  }

  createProductImage(productId: any, image: any) {
    return this.http.post<any>(`${this.apiUrl}/products/${productId}/productimage`, image)
  }

  createCategory(category: any) {
    return this.http.post<any>(`${this.apiUrl}/categories`, category)
  }

  createProductCategory(categoryId: any, productId: any) {
    return this.http.post<any>(`${this.apiUrl}/products/${productId}/categories/${categoryId}`, {})
  }

  removeProductCategory(productId: any, categoryId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${productId}/categories/${categoryId}`);
  }

  addSizes(size: any) {
    return this.http.post<any>(`${this.apiUrl}/sizes`, size)
  }

  addProductSizes(productId: any, sizeId: any) {
    return this.http.post<any>(`${this.apiUrl}/products/${productId}/sizes/${sizeId}`, {})
  }

  removeProductSizes(productId: any, sizeId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${productId}/sizes/${sizeId}`);
  }

}
