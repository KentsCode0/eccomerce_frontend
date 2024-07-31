import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ProductService } from '../../../../shared/services/product.service';
import { CartService } from '../../../../shared/services/cart.service';
import { CommonModule } from '@angular/common';
import product from '../../../../models/product.models';
import { TokenService } from '../../../../shared/services/token.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.product) {
      this.productId = this.product.product_id.toString();
      this.getAllProducts();
      this.getProductSizes();
    }
  }

  onClose() {
    this.closePopup.emit();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (response) => {
        this.products = response.data.product;
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
      const productToAdd = {
        user_id: userId,
        product_id: this.product.product_id.toString(),
        size_id: this.selectedSize.toString(),
        quantity: this.quantity,
      };

      this.cartService.getCart().subscribe(
        (cart) => {

          // Ensure cart.data.carts is an array
          const cartItems = Array.isArray(cart.data.carts) ? cart.data.carts : [];

          const existingItem = cartItems.find(
            (item: any) =>
              item.product_id.toString() === productToAdd.product_id && item.size_id.toString() === productToAdd.size_id
          );

          if (existingItem) {
            // Product with the same product_id and size_id exists, update the quantity
            const updatedQuantity = existingItem.quantity + this.quantity;

            this.cartService.editCart(userId, productToAdd.product_id, productToAdd.size_id, updatedQuantity).subscribe(
              (response) => {
                this.cartService.getCart().subscribe(); // Trigger cart refresh
              },
              (error) => {
                console.error('Error updating product in cart:', error);
              }
            );
          } else {
            // Product with the same product_id and size_id does not exist, add new item to cart
            this.cartService.insertProductToCart(productToAdd).subscribe(
              (response) => {
                this.cartService.getCart().subscribe(); // Trigger cart refresh
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
