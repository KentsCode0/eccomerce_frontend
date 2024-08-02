import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../../../shared/services/product.service';
import { CartService } from '../../../../shared/services/cart.service';
import { CommonModule } from '@angular/common';
import product from '../../../../models/product.models';
import { TokenService } from '../../../../shared/services/token.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input() product: product | null = null;
  @Output() closePopup = new EventEmitter<void>();
  @Output() switchProduct = new EventEmitter<product>();
  productId: string | null = null;
  products: Array<product> = [];
  filteredProducts: Array<product> = [];
  sizes: any[] = [];
  selectedSize: string | null = null;
  quantity: number = 1; // Initialize quantity
  availableStock: number = 0; // Initialize available stock
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private tokenService: TokenService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.product) {
      this.productId = this.product.product_id.toString();
      this.getAllProducts();
      this.getProductSizes();
      this.availableStock = this.product.stock; // Set available stock
    }
  }

  onClose() {
    this.closePopup.emit();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (response) => {
        this.products = response.data.product;
        console.log(this.products);
        this.filterOtherProducts();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getProductSizes() {
    this.productService.getProductSizes(this.productId).subscribe(
      (response) => {
        this.sizes = response.data.sizes;
        if (this.sizes.length > 0) {
          this.selectedSize = this.sizes[0].size_id; // Set default size to the first one
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  filterOtherProducts() {
    this.filteredProducts = this.products.filter(
      (product) => product.product_id.toString() !== this.productId
    );
  }

  switchToProduct(product: product) {
    this.product = product;
    this.productId = product.product_id.toString();
    this.getProductSizes();
    this.availableStock = product.stock; // Update available stock when switching product
    this.filterOtherProducts();
    this.switchProduct.emit(product);
  }

  addToCart() {
    const userId = this.tokenService.getUserId();
    // Check if userId exists
    if (!userId) {
      // Redirect to login page
      this.router.navigate(['/login']);
      return;
    }

    if (this.product && this.selectedSize) {
      if (this.quantity > this.availableStock) {
        this.error = "The selected quantity exceeds the available stock.";
        
        // Clear the error message after 3 seconds
        setTimeout(() => {
          this.error = null;
        }, 3000);
        return; // Prevent further execution
      }

      const productToAdd = {
        user_id: userId,
        product_id: this.product.product_id.toString(),
        size_id: this.selectedSize.toString(),
        quantity: this.quantity,
      };

      this.cartService.getCart().subscribe(
        (cart) => {
          const cartItems = Array.isArray(cart.data.carts) ? cart.data.carts : [];
          const existingItem = cartItems.find(
            (item: any) =>
              item.product_id.toString() === productToAdd.product_id && item.size_id.toString() === productToAdd.size_id
          );

          if (existingItem) {
            const updatedQuantity = existingItem.quantity + this.quantity;

            this.cartService.editCart(userId, productToAdd.product_id, productToAdd.size_id, updatedQuantity).subscribe(
              (response) => {
                this.cartService.getCart().subscribe(); // Trigger cart refresh
                this.snackBar.open('Product added to cart!', 'Close', {
                  duration: 3000,
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                });
              },
              (error) => {
                console.error('Error updating product in cart:', error);
              }
            );
          } else {
            this.cartService.insertProductToCart(productToAdd).subscribe(
              (response) => {
                this.cartService.getCart().subscribe(); // Trigger cart refresh
                this.snackBar.open('Product added to the cart successfully!', 'Close', {
                  duration: 3000
                });
              },
              (error) => {
                console.error('Error adding product to cart:', error);
              }
            );
          }
        },
        (error) => {
          this.cartService.insertProductToCart(productToAdd).subscribe(
            (response) => {
              this.cartService.getCart().subscribe(); // Trigger cart refresh
              this.snackBar.open('Product added to the cart successfully!', 'Close', {
                duration: 3000
              });
            },
            (error) => {
              console.error('Error adding product to cart:', error);
            }
          );
        }
      );
    }
  }

  onSizeSelect(size: string) {
    this.selectedSize = size;
  }
}
