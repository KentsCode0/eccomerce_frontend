import { ChangeDetectorRef, Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-item-cards',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './item-cards.component.html',
  styleUrls: ['./item-cards.component.css']
})
export class ItemCardsComponent implements OnDestroy {
  @Input() id: string = '';
  @Input() category_id: string = '';
  @Input() name: string = '';
  @Input() description: string = '';
  @Input() price: string = '';
  @Input() image: string = '';
  @Output() addToCart = new EventEmitter<void>();
  @Output() selectProduct = new EventEmitter<void>();

  private cartSubscription!: Subscription;
  cartItemCount: number = 0;
  isExpanded: boolean = false;
  
  constructor(private cartService: CartService, private cdr: ChangeDetectorRef, private router: Router, private userService: UserService) {
    this.updateCartCount();
  }

  addToCartHandler(event: Event) {
    event.stopPropagation(); // Prevent triggering the select event
    this.userService.getUserInformation().subscribe(
      response => {
        if (response.data.user.user_id) {
          const product = {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            image: this.image
          };
          this.cartService.addToCart(product);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error => {
        this.router.navigate(['/login']);
      }
    );
  }

  // toggleDescription() {
  //   this.isExpanded = !this.isExpanded;
  // }

  selectProductHandler() {
    this.selectProduct.emit();
  }

  shouldShowSeeMore(description: string): boolean {
    return description.length > 40;
  }

  updateCartCount() {
    this.cartSubscription = this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  goToProductItem() {
    this.router.navigate([`./product-item/${this.id}`])
  }
}
