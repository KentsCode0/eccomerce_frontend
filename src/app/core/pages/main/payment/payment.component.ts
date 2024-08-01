import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from '../../../../shared/navigation/navigation-bar/navigation-bar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutService } from '../../../../shared/services/checkout.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { response } from 'express';

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
  receiverName: string = '';
  receiverAddress: string = '';

  showModal = false;
  modalTitle = '';
  modalMessage = '';
  orderId: number | null = null;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    // Retrieve the orderId from query parameters
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
        this.receiverName = response.data.order.username;
        this.receiverAddress = response.data.order.address; 
        console.log(response)
      },
      (error) => {
        this.showModalPopup('Error', 'Failed to fetch order details.');
        console.error('Error fetching order details:', error);
      }
    );
  }

  processPayment() {
    if (!this.receiverName.trim() || !this.receiverAddress.trim()) {
      this.showModalPopup('Error', 'Please provide the receiver\'s name and address.');
      return;
    }

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
      (response)=> {
        console.log(response)
        setTimeout(() => this.router.navigate(['/product-list']), 2000);
      }
    )
     // Navigate after showing success message
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