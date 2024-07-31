import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { TokenService } from '../../services/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;
  isOpen = false;
  userInfo = {
    user_id: 0,
    username: '',
    email: ''
  };

  private cartSubscription!: Subscription;

  constructor(
    private router: Router,
    private cartService: CartService,
    private tokenService: TokenService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Fetch initial cart count
    this.loadCartCount();

    // Subscribe to cart item count changes
    this.cartSubscription = this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
      this.cdr.markForCheck(); // Ensure Angular detects the change
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // Method to load cart count initially
  private loadCartCount(): void {
    this.cartService.getCart().subscribe(cartResponse => {
      this.cartService.updateCartCount(cartResponse); // Ensure cart count is updated
    });
  }

  navigateToCart() {
    this.router.navigate([`./cart`]);
  }
}
