import { ChangeDetectorRef, Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from '../../../shared/services/token.service';
import product from '../../../models/product.models';

@Component({
  selector: 'app-item-cards',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './item-cards.component.html',
  styleUrls: ['./item-cards.component.css']
})
export class ItemCardsComponent implements OnDestroy {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() description: string = '';
  @Input() price: string = '';
  @Input() image: string = '';
  @Input() product: product | null = null;
  @Output() addToCart = new EventEmitter<{ product_id: string, size_id: number, quantity: number }>();
  @Output() selectProduct = new EventEmitter<void>();

  size_id: number = 1; // Default size_id
  quantity: number = 1;

  private cartSubscription!: Subscription;
  cartItemCount: number = 0;
  isExpanded: boolean = false;

  constructor(private cartService: CartService, private cdr: ChangeDetectorRef, private router: Router, private tokenService: TokenService) {
    this.updateCartCount();
  }

  addToCartHandler(event: Event) {
    // event.stopPropagation(); // Prevent triggering the select event
    if (this.product) {
      this.addToCart.emit({
        product_id: this.product.product_id.toString(), // Ensure it is a string
        size_id: this.size_id,
        quantity: this.quantity
      });
    }
  }

  selectProductHandler() {
    this.selectProduct.emit();
  }

  shouldShowSeeMore(description: string): boolean {
    return description.length > 40;
  }

  truncateName(name: string): string {
    return name.length > 25 ? name.substring(0, 25) + '...' : name;
  }

  updateCartCount() {
    // this.cartSubscription = this.cartService.cartItemCount$.subscribe(count => {
    //   this.cartItemCount = count;
    // });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  goToProductItem() {
    this.router.navigate([`./product-item/${this.id}`]);
  }
}
