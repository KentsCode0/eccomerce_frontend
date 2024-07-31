import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { AdminService } from '../../../shared/services/admin.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-handleproducts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './handleproducts.component.html',
  styleUrls: ['./handleproducts.component.css']
})
export class HandleproductsComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  sizes: any[] = [];
  productCategories: { [key: number]: number[] } = {};
  productSizes: { [key: number]: number[] } = {};

  constructor(private productService: ProductService, private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getProducts();
    this.getCategories();
    this.getSizes();
  }

  getProducts() {
    this.productService.getAllProducts().subscribe(
      (response) => {
        this.products = response.data.product;
        this.products.forEach(product => {
          this.productCategories[product.product_id] = [];
          this.productSizes[product.product_id] = [];
          this.getProductCategories(product.product_id);
          this.getProductSizes(product.product_id);
        });
      },
      (error) => {
        console.error('Failed to fetch products', error);
      }
    );
  }

  getCategories() {
    this.productService.getAllProductCategory().subscribe(
      (response) => {
        this.categories = response.data.categories;
      },
      (error) => {
        console.error('Failed to fetch categories', error);
      }
    );
  }

  getSizes() {
    this.productService.getAllProductSizes().subscribe(
      (response) => {
        this.sizes = response.data.sizes;
      },
      (error) => {
        console.error('Failed to fetch sizes', error);
      }
    );
  }

  getProductCategories(productId: number) {
    this.productService.getProductCategory(productId).subscribe(
      (response) => {
        this.productCategories[productId] = response.data.categories.map((category: any) => category.category_id);
      },
      (error) => {
        console.error('Failed to fetch product categories', error);
      }
    );
  }

  getProductSizes(productId: number) {
    this.productService.getProductSizes(productId).subscribe(
      (response) => {
        this.productSizes[productId] = response.data.sizes.map((size: any) => size.size_id);
      },
      (error) => {
        console.error('Failed to fetch product sizes', error);
      }
    );
  }

  onCategoryChange(event: any, productId: number) {
    const categoryId = +event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      this.addCategoryToProduct(productId, categoryId);
    } else {
      this.removeCategoryFromProduct(productId, categoryId);
    }
  }

  onSizeChange(event: any, productId: number) {
    const sizeId = +event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      this.addSizeToProduct(productId, sizeId);
    } else {
      this.removeSizeFromProduct(productId, sizeId);
    }
  }

  addCategoryToProduct(productId: number, categoryId: number) {
    this.adminService.createProductCategory(categoryId, productId).subscribe(
      () => {
        this.productCategories[productId].push(categoryId);
      },
      (error) => {
        console.error('Failed to add category', error);
      }
    );
  }

  removeCategoryFromProduct(productId: number, categoryId: number) {
    this.adminService.removeProductCategory(productId, categoryId).subscribe(
      () => {
        const index = this.productCategories[productId].indexOf(categoryId);
        if (index > -1) {
          this.productCategories[productId].splice(index, 1);
        }
      },
      (error) => {
        console.error('Failed to remove category', error);
      }
    );
  }

  addSizeToProduct(productId: number, sizeId: number) {
    this.adminService.addProductSizes(productId, sizeId).subscribe(
      () => {
        this.productSizes[productId].push(sizeId);
      },
      (error) => {
        console.error('Failed to add size', error);
      }
    );
  }

  removeSizeFromProduct(productId: number, sizeId: number) {
    this.adminService.removeProductSizes(productId, sizeId).subscribe(
      () => {
        const index = this.productSizes[productId].indexOf(sizeId);
        if (index > -1) {
          this.productSizes[productId].splice(index, 1);
        }
      },
      (error) => {
        console.error('Failed to remove size', error);
      }
    );
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }
}
