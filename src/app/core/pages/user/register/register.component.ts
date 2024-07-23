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

  constructor(private userService: UserService, private router: Router) {}

  register() {
    this.userService.register(this.users).subscribe(
      (response: any) => {
        this.router.navigate(['/login']);
      },
      (error) => {
      }
    );
  }
}
