import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from '../../../../shared/navigation/navigation-bar/navigation-bar.component';
import { ItemCardsComponent } from "../../../components/item-cards/item-cards.component";
import { ProductService } from '../../../../shared/services/product.service';
import { CartService } from '../../../../shared/services/cart.service';
import product from '../../../../models/product.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductItemComponent } from "../product-item/product-item.component";
import { TokenService } from '../../../../shared/services/token.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NavigationBarComponent, ItemCardsComponent, CommonModule, FormsModule, ProductItemComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: product[] = [];
  filteredProducts: product[] = [];
  searchTerm: string = '';
  selectedProduct: product | null = null;
  categories: any[] = [];
  selectedCategory: string | null = null;

  constructor(private productService: ProductService, private cartService: CartService, private tokenService: TokenService) {}

  ngOnInit() {
    this.getAllProducts();
    this.getAllCategories();
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (response) => {
        this.products = response.data.product.map((p: any) => ({
          ...p,
          stock: p.stock // Ensure stock is included
        }));
        this.getProductCategories();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getAllCategories() {
    this.productService.getAllProductCategory().subscribe(
      (response) => {
        this.categories = response.data.categories;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getProductCategories() {
    this.products.forEach(product => {
      this.productService.getProductCategory(product.product_id).subscribe(
        (response) => {
          const categories = response.data.categories;
          if (categories && categories.length > 0) {
            product.category_id = categories.map((category: { category_id: any; }) => category.category_id); // Store all category IDs
          }
          this.filterProducts();
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  onSelectCategory(categoryId: string | null) {
    this.selectedCategory = categoryId;
    this.filterProducts();
  }
  
  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearchTerm = product.product_name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        product.product_description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || 
        (Array.isArray(product.category_id) && product.category_id.includes(this.selectedCategory));
      
      return matchesSearchTerm && matchesCategory;
    });
  }

  onAddToCart(event: { product_id: string, size_id: number, quantity: number }) {
    const userId = this.tokenService.getUserId();
    const productToAdd = {
      user_id: userId,
      product_id: event.product_id,
      size_id: event.size_id,
      quantity: event.quantity,
    };
    this.cartService.insertProductToCart(productToAdd).subscribe(
      (response) => {
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSelectProduct(product: product) {
    this.selectedProduct = product;
  }

  onClosePopup() {
    this.selectedProduct = null;
  }

  onSwitchProduct(product: product) {
    this.selectedProduct = product;
  }
}
