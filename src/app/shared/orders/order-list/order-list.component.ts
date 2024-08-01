import { Component } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {
  completedOrders: any[] = [];
  showItems: { [key: number]: boolean } = {}; // Track visibility of items for each order

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit(): void {
    this.fetchCompletedOrders();
  }

  fetchCompletedOrders(): void {
    this.checkoutService.getOrders().subscribe(
      response => {
        const allOrders = response.data.orders;
        this.completedOrders = allOrders.filter((order: any) => order.status === 'completed');
        
        // Initialize visibility tracking for each order
        this.completedOrders.forEach(order => {
          this.showItems[order.order_id] = false; // Initially hide items
        });

        console.log('Completed Orders:', this.completedOrders);
      },
      error => {
        console.error('Error fetching orders', error);
      }
    );
  }

  toggleItems(orderId: number): void {
    this.showItems[orderId] = !this.showItems[orderId];
  }
}