import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from "../../../../shared/navigation/navigation-bar/navigation-bar.component";
import { CartService } from '../../../../shared/services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [NavigationBarComponent, CommonModule, FormsModule],
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    console.log(this.cartItems);
  }

  getTotalPrice(): number {
    const total = this.cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + (+item.price * item.quantity), 0);
  
    return parseFloat(total.toFixed(2));
  }
  

  removeFromCart(index: number) {
    this.cartService.removeFromCart(index);
    this.cartItems = this.cartService.getCartItems();
  }

  increaseQuantity(itemId: number, size: string) {
    this.cartService.increaseQuantity(itemId, size);
    this.cartItems = this.cartService.getCartItems();
  }

  decreaseQuantity(itemId: number, size: string) {
    this.cartService.decreaseQuantity(itemId, size);
    this.cartItems = this.cartService.getCartItems();
  }

  toggleSelection(item: any) {
    item.selected = !item.selected;
  }

  selectAll(event: any) {
    const isChecked = event.target.checked;
    this.cartItems.forEach(item => item.selected = isChecked);
  }

  allSelected(): boolean {
    return this.cartItems.length > 0 && this.cartItems.every(item => item.selected);
  }

  hasSelectedItems(): boolean {
    return this.cartItems.some(item => item.selected);
  }

  goToCheckout() {
    const selectedItems = this.cartItems.filter(item => item.selected);
    if (selectedItems.length > 0) {
      this.cartService.setItems(selectedItems, this.getTotalPrice());
      this.router.navigate(['/payment']);
    } else {
      alert('Please select at least one item.');
    }
  }
}