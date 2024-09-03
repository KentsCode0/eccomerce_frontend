import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DropdownComponent } from "../dropdown/dropdown.component";
import { userDropdownComponent } from '../../../core/pages/user/user-dropdown/user-dropdown.component';
import { TokenService } from '../../services/token.service';


@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [RouterModule, DropdownComponent, userDropdownComponent],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent {

  constructor(private router: Router, private tokenService: TokenService){}
  
  navigateToCart() {
    this.router.navigate([`./cart`])
  }

  navigateToProductlist() {
    this.router.navigate([`./product-list`])
  }

  signOut() {
    this.tokenService.clearAuth();
  }

}
