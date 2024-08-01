  import { Component, HostListener, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { UserService } from '../../../../shared/services/user.service';
  import { CommonModule } from '@angular/common';
  import { NavigationBarComponent } from "../../../../shared/navigation/navigation-bar/navigation-bar.component";
  import { CartListComponent } from "../../main/cart-list/cart-list.component";
  import { DropdownComponent } from "../../../../shared/navigation/dropdown/dropdown.component";
import { OrderListComponent } from "../../../../shared/orders/order-list/order-list.component";

  @Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, NavigationBarComponent, ReactiveFormsModule, CartListComponent, DropdownComponent, OrderListComponent],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
  })
  export class ProfileComponent implements OnInit {
    userInfo: any = {
      user_id: 0,
      username: '',
      email: '',
      avatar: '',
      address: '',
    };
    userForm!: FormGroup;
    fileToUpload: File | null = null;
    showSubmitButton = false;

    errors = {
      username: "",
    }

    constructor(
      private userService: UserService,
      private fb: FormBuilder
    ) {}

    ngOnInit(): void {
      this.initializeForm();
      this.fetchUserInfo();

      // Show submit button based on address field value changes
      this.userForm.get('address')?.valueChanges.subscribe(value => {
        this.showSubmitButton = value.trim() !== '';
      });
    }

    initializeForm() {
      this.userForm = this.fb.group({
        username: ['', Validators.required],
        email: [{ value: '', disabled: true }], // Disabled email field
        address: ['']
      });
    }

    fetchUserInfo() {
      this.userService.getUserInformation().subscribe(
        response => {
          this.userInfo = response.data.user;
          this.userForm.patchValue({
            username: this.userInfo.username,
            email: this.userInfo.email,
            address: this.userInfo.address
          });
        },
        error => {
          console.error('Error fetching user information', error);
        }
      );
    }

    @HostListener('focusin', ['$event'])
    onFocus(event: Event) {
      this.showSubmitButton = true;
    }

    @HostListener('focusout', ['$event'])
    onBlur(event: Event) {
      // Check if the form has any value in any field before hiding the submit button
      if (!this.userForm.dirty || 
          !this.userForm.get('username')?.value.trim() && 
          !this.userForm.get('address')?.value.trim()) {
        this.showSubmitButton = false;
      }
    }

    updateUser() {
      const formValue = this.userForm.value;
      const updatedUser: any = {};

      // Include username only if it has been modified
      if (formValue.username !== this.userInfo.username) {
        updatedUser.username = formValue.username;
      }

      // Add address to payload only if it is provided
      if (formValue.address) {
        updatedUser.address = formValue.address;
      }

      // Update user only if there is something to send
      if (Object.keys(updatedUser).length > 0) {
        this.userService.editUser(updatedUser).subscribe(
          response => {
            console.log('User updated successfully', response);
            this.fetchUserInfo(); // Refresh user info after update
          },
          error => {
            let errors = error.error.errors;
            this.errors["username"] = errors["username"] || "An error occurred";
            
            // Clear the error messages after 3 seconds
            setTimeout(() => {
              this.errors = {
                username: '',
              };
            }, 3000);
          }
        );
      }
    }

    handleFileInput(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.fileToUpload = input.files[0];
        this.uploadAvatar();
      }
    }

    uploadAvatar() {
      if (this.fileToUpload) {
        const formData = new FormData();
        formData.append('image', this.fileToUpload);

        this.userService.uploadAvatar(formData).subscribe(
          response => {
            console.log('Avatar uploaded successfully', response);
            this.fetchUserInfo(); // Refresh user info to update the avatar
          },
          error => {
            console.error('Error uploading avatar', error);
          }
        );
      }
    }
  }