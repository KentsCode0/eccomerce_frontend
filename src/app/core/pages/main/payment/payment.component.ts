import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from '../../../../shared/navigation/navigation-bar/navigation-bar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutService } from '../../../../shared/services/checkout.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { UserService } from '../../../../shared/services/user.service';
import { TokenService } from '../../../../shared/services/token.service';
import { CartService } from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [NavigationBarComponent, CommonModule, FormsModule, ModalComponent],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  items: any[] = [];
  total: number = 0;
  selectedPaymentMethod: string = '';
  cardNumber: string = '';
  selectedEWallet: string = '';
  username: string = '';
  address: string = '';

  showModal = false;
  modalTitle = '';
  modalMessage = '';
  orderId: number | null = null;

  private originalUsername: string = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private checkoutService: CheckoutService,
    private userService: UserService,
    private tokenService: TokenService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Retrieve the orderId from query parameters
    const userId = this.tokenService.getUserId();
    console.log(userId);
    // Check if userId exists
   
    this.route.queryParams.subscribe(params => {
      this.orderId = +params['orderId'];
      if (this.orderId) {
        this.fetchOrderDetails(this.orderId);
      } else {
        this.showModalPopup('Error', 'No order ID found.');
      }
    });
  }

  fetchOrderDetails(orderId: number) {
    this.checkoutService.getOrderDetails(orderId).subscribe(
      (response: any) => {
        const orderDetails = response.data.order;
        this.items = orderDetails.items; // Retrieve items
        this.total = parseFloat(orderDetails.total_amount); // Update total
        this.username = orderDetails.username;
        this.address = orderDetails.address;
        this.originalUsername = orderDetails.username;
        console.log(response);
      },
      (error) => {
        this.showModalPopup('Error', 'Failed to fetch order details.');
        console.error('Error fetching order details:', error);
      }
    );
  }

  updateAddressAndProcessPayment() {
    if (!this.username.trim() || !this.address.trim()) {
      this.showModalPopup('Error', 'Please provide the receiver\'s name and address.');
      return;
    }

    // Only include the username if it has been modified
    const updatedUser: any = { address: this.address };
    if (this.username !== this.originalUsername) {
      updatedUser.username = this.username;
    }

    this.userService.editUser(updatedUser).subscribe(
      response => {
        console.log('Address updated successfully', response);
        this.processPayment(); // Proceed with payment after updating address
      },
      error => {
        this.showModalPopup('Error', 'Failed to update address.');
        console.error('Error updating address:', error);
      }
    );
  }

  processPayment() {
    if (!this.selectedPaymentMethod) {
      this.showModalPopup('Error', 'Please select a payment method.');
      return;
    }

    if (this.selectedPaymentMethod === 'ewallet' && !this.selectedEWallet) {
      this.showModalPopup('Error', 'Please select an E-Wallet.');
      return;
    }

    if (this.selectedPaymentMethod === 'creditCard' && !this.cardNumber) {
      this.showModalPopup('Error', 'Please enter your card number.');
      return;
    }

    // Proceed with payment processing here
    this.showModalPopup('Success', 'Payment submitted successfully!');
    this.checkoutService.completePayment(this.orderId).subscribe(
      (response) => {
        console.log(response);
        this.clearCartAfterPayment();
         this.router.navigate(['/product-list'])
      },
      (error) => {
        this.showModalPopup('Error', 'Failed to complete payment.');
        console.error('Error completing payment:', error);
      }
    );
  }

  clearCartAfterPayment() {
    const userId = this.tokenService.getUserId();
    this.items.forEach(item => {
      this.cartService.deleteItemFromCart(userId, item.product_id, item.size_id).subscribe(
        () => {
          console.log(`Deleted product ${item.product_id} with size ${item.size_id} from cart`);
        },
        error => {
          console.error('Error deleting item from cart:', error);
        }
      );
    });
  }

  showModalPopup(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
