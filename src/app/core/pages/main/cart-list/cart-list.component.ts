import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from "../../../../shared/navigation/navigation-bar/navigation-bar.component";
import { CartService } from '../../../../shared/services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../../../shared/services/token.service';
import { ProductService } from '../../../../shared/services/product.service';
import { CheckoutService } from '../../../../shared/services/checkout.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [NavigationBarComponent, CommonModule, FormsModule],
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit {
  products: any[] = [];
  sizes: any[] = [];
  userId: any | null = null;
  
  constructor(
    private cartService: CartService, 
    private router: Router, 
    private tokenService: TokenService, 
    private productService: ProductService,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit() {
    this.userId = this.tokenService.getUserId();
    this.getProductSizes();
  }

  getCartProducts() {
    this.cartService.getCart().subscribe(
      (response) => {
        this.products = response.data.carts.map((item: any) => {
          const size = this.sizes.find(size => size.size_id === item.size_id);
          return {
            ...item,
            size_label: size ? size.size_label : 'Unknown Size',
            selected: false
          };
        });
      }
    );
  }

  getProductSizes() {
    this.productService.getAllProductSizes().subscribe(
      (response) => {
        this.sizes = response.data.sizes;
        this.getCartProducts(); // Fetch the cart products after the sizes have been loaded
      }
    );
  }

  removeFromCart(productId: number, sizeId: number) {
    this.cartService.deleteItemFromCart(this.userId, productId, sizeId).subscribe(
      () => {
        this.getCartProducts(); // Refresh the cart after removal
      }
    )
  }

  increaseQuantity(productId: number, sizeId: number, currentQuantity: number) {
    this.cartService.editCart(this.userId, productId, sizeId, currentQuantity + 1).subscribe(
      () => {
        this.getCartProducts(); // Refresh the cart after increasing quantity
      }
    )
  }

  decreaseQuantity(productId: number, sizeId: number, currentQuantity: number) {
    if (currentQuantity < 2) {
      this.cartService.deleteItemFromCart(this.userId, productId, sizeId).subscribe(
        () => {
          this.getCartProducts(); // Refresh the cart after decreasing quantity
        }
      )
    } 
    else {
      this.cartService.editCart(this.userId, productId, sizeId, currentQuantity - 1).subscribe(
        () => {
          this.getCartProducts(); // Refresh the cart after increasing quantity
        }
      )
    }
  }

  onQuantityChange(event: any, productId: number, sizeId: number) {
    const newQuantity = parseInt(event.target.value, 10);
    if (newQuantity === 0) {
      this.removeFromCart(productId, sizeId);
    } else {
      this.cartService.editCart(this.userId, productId, sizeId, newQuantity).subscribe(
        () => {
          this.getCartProducts(); // Refresh the cart after updating quantity
        }
      );
    }
  }

  toggleSelection(item: any) {
    item.selected = !item.selected;
  }

  selectAll(event: any) {
    const isChecked = event.target.checked;
    this.products.forEach(item => item.selected = isChecked);
  }

  allSelected(): boolean {
    return this.products.every(item => item.selected);
  }

  hasSelectedItems(): boolean {
    return this.products.some(item => item.selected);
  }

  getTotalPrice(): string {
    const total = this.products
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
    
    return total.toFixed(2);
  }  

  goToCheckout() {
    if (this.hasSelectedItems()) {
      const selectedItems = this.products
        .filter(item => item.selected)
        .map(item => ({
          product_id: item.product_id,
          size_id: item.size_id,
          quantity: item.quantity,
          price: parseFloat(item.product_price).toFixed(2) // Format price correctly
        }));
  
      console.log(selectedItems);
  
      const total = parseFloat(this.getTotalPrice());
  
      this.checkoutService.createOrder(this.userId, total).subscribe(
        (response: any) => {
          const orderId = response.data.order_id;
          console.log(orderId);
  
          // Get an array of observables for creating order items
          const observables = this.checkoutService.createOrderItems(orderId, selectedItems);
  
          // Execute each observable one at a time
          forkJoin(observables).subscribe(
            () => {
              console.log(response);
              this.router.navigate(['/payment'], { queryParams: { orderId } });
            },
            (error) => {
              console.error('Failed to create order item:', error);
            }
          );
        },
        (error) => {
          console.error('Failed to create order:', error);
        }
      );
    }
  }
}
