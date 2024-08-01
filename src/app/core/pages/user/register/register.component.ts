import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../../../shared/services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  users = {
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  };

  errors = {
    username: "",
    email: "",
    password: "",
    password1: ""
  }

  constructor(private userService: UserService, private router: Router) {}

  register() {
    this.userService.register(this.users).subscribe(
      (response: any) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        let errors = error.error.errors;
          this.errors["username"] = errors["username"];
          this.errors["email"] = errors["email"];
          this.errors["password"] = errors["password"];
          this.errors["password1"] = errors["password1"];
  
          // Clear the error messages after 3 seconds
          setTimeout(() => {
            this.errors = {
              username: '',
              email: '',
              password: '',
              password1: ''
            };
          }, 3000);

      }
    );
  }
}
