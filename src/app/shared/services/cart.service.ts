import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost/ecommerce-api/public/api';
  private cartItemCountSubject = new BehaviorSubject<number>(0);

  cartItemCount$ = this.cartItemCountSubject.asObservable();

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  insertProductToCart(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cart`, product).pipe(
      tap(() => {
        this.updateCartCount();  // Update cart count after adding a product
      }),
      catchError(error => {
        console.error('Error adding product to cart:', error);
        return throwError(error);
      })
    );
  }
  
  getCart(): Observable<any> {
    const userId = this.tokenService.getUserId();
    return this.http.get<any>(`${this.apiUrl}/cart/${userId}`).pipe(
      tap(cart => {
        this.updateCartCount(cart);
      }),
      catchError(error => {
        console.error('Error fetching cart:', error);
        return throwError(error);
      })
    );
  }
  

  editCart(userId: any, productId: any, sizeId: any, quantity: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cart/${userId}/${productId}/${sizeId}`, { quantity }).pipe(
      tap(() => this.updateCartCount())
    );
  }
  
  deleteItemFromCart(userId: any, productId: any, sizeId: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/cart/${userId}/${productId}/${sizeId}`).pipe(
      tap(() => {
        this.updateCartCount();
        // Reload the window after updating the cart count
        window.location.reload();
      })
    );
  }

  public updateCartCount(cartResponse?: any): void {
    if (cartResponse && cartResponse.data) {
  
      const cartItems = Array.isArray(cartResponse.data.carts) ? cartResponse.data.carts : [];
  
      const totalQuantity = cartItems.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);
  
      this.cartItemCountSubject.next(totalQuantity);
    } else {
      this.cartItemCountSubject.next(0);
    }
  }
  
}
