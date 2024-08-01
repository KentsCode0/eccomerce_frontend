import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
private apiUrl = 'http://localhost/ecommerce-api/public/api'
  constructor(private http: HttpClient) { }

  getItems() {
    // Logic to get items from cart
  }

  getTotal() {
    // Logic to calculate total amount
  }

  createOrder(userId: number, totalAmount: number, items: any[]) {
    // Create an order
    return this.http.post(`${this.apiUrl}/orders`, { user_id: userId, total_amount: totalAmount })
      .toPromise()
      .then((orderResponse: any) => {
        const orderId = orderResponse.id;

        // Create order items
        const orderItemsPromises = items.map(item => 
          this.http.post(`${this.apiUrl}/order-items`, {
            order_id: orderId,
            product_id: item.product_id,
            size_id: item.size_id,
            quantity: item.quantity,
            price: item.price
          }).toPromise()
        );

        return Promise.all(orderItemsPromises);
      });
  }

  fetchOrder(orderId: number) {
    return this.http.get(`${this.apiUrl}/orders/${orderId}`).toPromise();
  }

  fetchOrderItems(orderId: number) {
    return this.http.get(`${this.apiUrl}/orders/${orderId}/items`, { params: { orderId: orderId.toString() } }).toPromise();
  }
}
