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
    // Check if cartResponse and cartResponse.data are defined
    if (cartResponse && cartResponse.data) {
      // Log the entire response for debugging
  
      // Ensure cartItems is an array
      const cartItems = Array.isArray(cartResponse.data.carts) ? cartResponse.data.carts : [];
  
      // Calculate total quantity
      const totalQuantity = cartItems.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);
  
      // Log total quantity for debugging
  
      this.cartItemCountSubject.next(totalQuantity);
    } else {
      // Log response for debugging
      this.cartItemCountSubject.next(0);
    }
  }
  
}
