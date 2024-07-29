import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TokenService } from './token.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY_PREFIX = 'cart_items_'; 
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();
  private items: any[] = [];
  private total: number = 0;

  constructor(private cookieService: CookieService, private tokenService: TokenService) {
    this.updateCartItemCount(); // Initialize the cart item count
  }

  // Retrieve cart items for the current user
  getCartItems(): any[] {
    const userId = this.tokenService.getUserId();
    if (!userId) {
      console.error('User ID not found');
      return [];
    }
    const cartItems = this.cookieService.get(this.CART_KEY_PREFIX + userId);
    return cartItems ? JSON.parse(cartItems) : [];
  }

  // Save cart items for the current user
  saveCartItems(items: any[]): void {
    const userId = this.tokenService.getUserId();
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    this.cookieService.set(this.CART_KEY_PREFIX + userId, JSON.stringify(items));
    this.updateCartItemCount(); // Update cart item count
  }

  // Add an item to the cart
  addToCart(item: any): void {
    const cartItems = this.getCartItems();
    const existingItem = cartItems.find(cartItem => 
      cartItem.id.toString() === item.id.toString() &&
      cartItem.size === item.size
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      item.quantity = 1;
      cartItems.push(item);
    }

    this.saveCartItems(cartItems);
  }

  // Remove an item from the cart
  removeFromCart(index: number): void {
    const cartItems = this.getCartItems();
    cartItems.splice(index, 1);
    this.saveCartItems(cartItems);
  }

  // Increase the quantity of an item
  increaseQuantity(itemId: number, size: string): void {
    const cartItems = this.getCartItems();
    const item = cartItems.find(cartItem => 
      cartItem.id === itemId &&
      cartItem.size === size
    );

    if (item) {
      item.quantity += 1;
      this.saveCartItems(cartItems);
    }
  }

  // Decrease the quantity of an item
  decreaseQuantity(itemId: number, size: string): void {
    const cartItems = this.getCartItems();
    const item = cartItems.find(cartItem => 
      cartItem.id === itemId &&
      cartItem.size === size
    );

    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        // Remove the item if quantity is 1
        const index = cartItems.indexOf(item);
        cartItems.splice(index, 1);
      }
      this.saveCartItems(cartItems);
    }
  }

  // Update the count of items in the cart
  updateCartItemCount(): void {
    const cartItems = this.getCartItems();
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    this.cartItemCountSubject.next(itemCount);
  }
  
  // Set items to payment
  setItems(items: any[], total: number) {
    this.items = items;
    this.total = parseFloat(total.toFixed(2));
  }

  // Get items
  getItems() {
    return this.items;
  }

  // Get total
  getTotal() {
    return this.total;
  }
}
