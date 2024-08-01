import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../shared/services/user.service';
import { response } from 'express';
import { error } from 'console';
import { cpSync } from 'fs';
import { TokenService } from '../../../../shared/services/token.service';
import { NavigationBarComponent } from "../../../../shared/navigation/navigation-bar/navigation-bar.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, NavigationBarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
credentials = {
  email: '',
  password: ''
}

error: string | null = null;

constructor (private userService: UserService, private router: Router, private tokenService: TokenService){}
ngOnInit(): void {
  if (this.tokenService.getToken()?.length !== 0) {
    this.router.navigate(["/product-list"]); 
  }
}

login() {
  this.userService.login(this.credentials).subscribe(
    (response)=> {
      const token = response.data.token;
      const userId = response.data.user_id;

      this.tokenService.setAuthorization(token, userId);
      
      window.location.reload();

      this.router.navigate(['../product-list']);
    },
    (error)=> {
      this.error = error.error.errors;
        
        // Clear the error message after 3 seconds
        setTimeout(() => {
          this.error = null;
        }, 3000);
    }
  )
}

}
