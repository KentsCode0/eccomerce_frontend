import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { response } from 'express';
import { CartService } from '../../services/cart.service';
import { TokenService } from '../../services/token.service';


@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  cartItemCount: number = 0;
  isOpen = false;
  userInfo = {
    user_id: 0,
    username: '',
    email: ''
  }

  constructor(private router: Router, private userService: UserService, private cartService: CartService, private tokenService: TokenService){}

  ngOnInit(): void {
    this.getUser();
    this.updateCartItemCount();
  }

  getUser() {
    this.userService.getUserInformation().subscribe(
      (response)=>{
        this.userInfo.username = response.data.user.username;
        this.userInfo.email = response.data.user.email;
      }
    )
  }

  navigateToCart() {
    this.router.navigate([`./cart`])
  }

  signOut() {
    this.tokenService.clearAuth();
  }
  
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  updateCartItemCount() {
    this.cartItemCount = this.cartService.getCartItemCount();
  }
}
