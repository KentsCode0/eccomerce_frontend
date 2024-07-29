import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
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
    private userService: UserService,
    private cartService: CartService,
    private tokenService: TokenService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.getUser();
    this.cartSubscription = this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // getUser() {
  //   this.userService.getUserInformation().subscribe(response => {
  //     this.userInfo.username = response.data.user.username;
  //     this.userInfo.email = response.data.user.email;
  //   });
  // }

  navigateToCart() {
    this.router.navigate([`./cart`]);
  }

  // signOut() {
  //   this.tokenService.clearAuth();
  // }

  // toggleDropdown() {
  //   this.isOpen = !this.isOpen;
  // }

  // closeDropdown() {
  //   this.isOpen = false;
  // }
}
