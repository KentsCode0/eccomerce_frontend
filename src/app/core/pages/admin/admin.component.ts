import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../shared/services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  product = {
    product_name: '',
    product_description: '',
    product_image: '',
    product_price: 0
  };
  selectedImage: File | null = null;
  productId: number = 0;

  categories: any[] = [];
  sizes: any[] = [];
  selectedCategories: number[] = [];
  selectedSizes: number[] = [];

  showCategoryModal = false;
  showSizeModal = false;
  newCategoryName = '';
  newSizeLabel = '';

  ngOnInit() {
    this.getCategories();
    this.getSizes();
  }

  constructor(private adminService: AdminService, private router: Router, private productService: ProductService) {}

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

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onCategoryChange(event: any) {
    const categoryId = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      const index = this.selectedCategories.indexOf(categoryId);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }
  
  onSizeChange(event: any) {
    const sizeId = event.target.value;
    if (event.target.checked) {
      this.selectedSizes.push(sizeId);
    } else {
      const index = this.selectedSizes.indexOf(sizeId);
      if (index > -1) {
        this.selectedSizes.splice(index, 1);
      }
    }
  }

  onSubmit() {
    this.adminService.createProduct(this.product).subscribe(
      (response) => {
        this.productId = response.data.product.product_id;

        if (this.selectedImage) {
          const formData = new FormData();
          formData.append('image', this.selectedImage);
          this.adminService.createProductImage(this.productId, formData).subscribe(
            (imageResponse) => {
            },
            (error) => {
              console.error('Image upload failed', error);
            }
          );
        }

        // Assign categories
        this.selectedCategories.forEach((categoryId) => {
          this.adminService.createProductCategory(categoryId, this.productId).subscribe(
            (categoryResponse) => {
            },
            (error) => {
              console.error('Failed to assign category', error);
            }
          );
        });

        // Assign sizes
        this.selectedSizes.forEach((sizeId) => {
          this.adminService.addProductSizes(this.productId, sizeId).subscribe(
            (sizeResponse) => {
            },
            (error) => {
              console.error('Failed to assign size', error);
            }
          );
        });

        alert('Product created successfully!');
        window.location.reload()
      },
      (error) => {
        console.error('Product creation failed', error);
      }
    );
  }

  goToProductList() {
    this.router.navigate(['/product-list']);
  }
  
  goToHandleProducts() {
    this.router.navigate(['/handle-products']);
  }

  toggleModal(type: 'category' | 'size') {
    if (type === 'category') {
      this.showCategoryModal = !this.showCategoryModal;
    } else if (type === 'size') {
      this.showSizeModal = !this.showSizeModal;
    }
  }

  createCategory() {
    this.adminService.createCategory({ category_name: this.newCategoryName }).subscribe(
      (response) => {
        this.getCategories();
        this.newCategoryName = '';
        this.showCategoryModal = false;
      },
      (error) => {
        console.error('Category creation failed', error);
      }
    );
  }

  createSize() {
    this.adminService.addSizes({ size_label: this.newSizeLabel }).subscribe(
      (response) => {
        this.getSizes();
        this.newSizeLabel = '';
        this.showSizeModal = false;
      },
      (error) => {
        console.error('Size creation failed', error);
      }
    );
  }
}
