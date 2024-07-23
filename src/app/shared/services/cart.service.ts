import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY_PREFIX = 'cart_items_'; 
  private items: any[] = [];
  private total: number = 0;

  constructor(private cookieService: CookieService, private tokenService: TokenService) {}

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
  }

  // Add an item to the cart
  addToCart(item: any): void {
    const cartItems = this.getCartItems();
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);

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
  increaseQuantity(itemId: number): void {
    const cartItems = this.getCartItems();
    const item = cartItems.find(cartItem => cartItem.id === itemId);

    if (item) {
      item.quantity += 1;
      this.saveCartItems(cartItems);
    }
  }

  // Decrease the quantity of an item
  decreaseQuantity(itemId: number): void {
    const cartItems = this.getCartItems();
    const item = cartItems.find(cartItem => cartItem.id === itemId);

    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        // Remove the item if quantity is 1
        const index = cartItems.indexOf(item);
        cartItems.splice(index, 1);
        window.location.reload();
      }
      this.saveCartItems(cartItems);
    }
  }

  // Get the count of items in the cart
  getCartItemCount(): number {
    const cartItems = this.getCartItems();
    return cartItems.length;
  }
  // set items to payment
  setItems(items: any[], total: number) {
    this.items = items;
    this.total = total;
  }
  // get items
  getItems() {
    return this.items;
  }
  // get total
  getTotal() {
    return this.total;
  }
}
