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

  constructor(private cartService: CartService, private Router: Router) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
  }

  processPayment() {
    console.log('Processing payment...');
    alert('Payment submitted!');
    this.Router.navigate([`/product-list`])
  }
  
}
