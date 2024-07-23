import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from '../../../../shared/navigation/navigation-bar/navigation-bar.component';
import { ItemCardsComponent } from "../../../components/item-cards/item-cards.component";
import { ProductService } from '../../../../shared/services/product.service';
import { CartService } from '../../../../shared/services/cart.service';
import product from '../../../../models/product.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NavigationBarComponent, ItemCardsComponent, CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Array<product> = [];
  filteredProducts: Array<product> = [];
  searchTerm: string = '';

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (response) => {
        this.products = response.data.product;
        this.filteredProducts = this.products;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  filterProducts() {
    if (this.searchTerm.trim() === '') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.product_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.product_description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onAddToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
