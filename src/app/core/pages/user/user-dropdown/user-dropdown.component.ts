import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../shared/services/user.service';
import { CartService } from '../../../../shared/services/cart.service';
import { TokenService } from '../../../../shared/services/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.css']
})
export class userDropdownComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;
  isOpen = false;
  userInfo = {
    user_id: 0,
    username: '',
    email: ''
  };
  userExists = false;

  private cartSubscription!: Subscription;

  constructor(
    private router: Router,
    private userService: UserService,
    private cartService: CartService,
    private tokenService: TokenService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkUser();
    // this.cartSubscription = this.cartService.cartItemCount$.subscribe(count => {
    //   this.cartItemCount = count;
    // });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  checkUser() {
    this.userService.getUserInformation().subscribe(
      response => {
        this.userInfo.user_id = response.data.user.user_id;
        this.userInfo.username = response.data.user.username;
        this.userInfo.email = response.data.user.email;
        this.userExists = true;
      },
      error => {
        this.userExists = false;
      }
    );
  }

  signOut() {
    this.tokenService.clearAuth();
    this.userExists = false;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
}