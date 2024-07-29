import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from '../../../../shared/navigation/navigation-bar/navigation-bar.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { CartService } from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [NavigationBarComponent, CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{
  items: any[] = [];
  total: number = 0;
  selectedPaymentMethod: string = '';
  cardNumber: string = '';

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  processPayment() {
    if (this.selectedPaymentMethod === 'creditCard' && !this.cardNumber) {
      alert('Please enter your card number.');
      return;
    }

    console.log('Processing payment...');
    console.log('Payment Method:', this.selectedPaymentMethod);
    if (this.selectedPaymentMethod === 'creditCard') {
      console.log('Card Number:', this.cardNumber);
    }
    alert('Payment submitted!');
    this.router.navigate(['/product-list']);
  }
}
