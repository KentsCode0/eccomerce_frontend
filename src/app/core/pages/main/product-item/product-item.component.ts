import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ProductService } from '../../../../shared/services/product.service';
import { CartService } from '../../../../shared/services/cart.service';
import { CommonModule } from '@angular/common';
import product from '../../../../models/product.models';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule],
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

  constructor(
    private productService: ProductService,
    private cartService: CartService
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
          this.selectedSize = this.sizes[0].size_label; // Set default size to the first one
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
    if (this.product && this.selectedSize) {
      const productToAdd = {
        id: this.product.product_id,
        name: this.product.product_name,
        description: this.product.product_description,
        price: this.product.product_price,
        image: this.product.product_image,
        size: this.selectedSize
      };
      this.cartService.addToCart(productToAdd);
    }
  }

  onSizeSelect(size: string) {
    this.selectedSize = size;
  }
}