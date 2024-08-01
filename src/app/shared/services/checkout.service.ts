import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  
private apiUrl = 'http://localhost/ecommerce-api/public/api'
  private items: any[] = [];
  private total: number = 0;

  constructor(private http: HttpClient) {}

  setItems(items: any[], total: number) {
  }

  getItems(order_id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders/${order_id}`) 
  }

  getOrders() {
    return this.http.get<any>(`${this.apiUrl}/orders`) 
  }

  getTotal() {
  }

  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders/${orderId}`);
  }

  // Create order
  createOrder(userId: number, totalAmount: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, { user_id: userId, total_amount: totalAmount });
  }

  // Create order items
  createOrderItems(orderId: number, items: any[]): Observable<any>[] {
    // Create an array of observables for each HTTP POST request
    const observables: Observable<any>[] = items.map((item: any) => {
      const orderItem = {
        order_id: +orderId,
        product_id: +item.product_id,
        size_id: +item.size_id,
        quantity: +item.quantity,
        price: parseFloat(item.price).toFixed(2) // Ensure price is formatted correctly
      };
  
      // Log the request payload for debugging
      console.log(orderItem);
  
      // Return an observable for the HTTP POST request
      return this.http.post<any>(`${this.apiUrl}/order-items`, orderItem);
    });
  
    return observables;
  }

  completePayment(orderId: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${orderId}/complete`, {});
  }
  
}
