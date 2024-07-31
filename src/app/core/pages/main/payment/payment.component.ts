import { Component, OnInit } from '@angular/core';
import { NavigationBarComponent } from '../../../../shared/navigation/navigation-bar/navigation-bar.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutService } from '../../../../shared/services/checkout.service';
import { ModalComponent } from '../../../../shared/modal/modal.component';

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

  showModal = false;
  modalTitle = '';
  modalMessage = '';

  constructor(private router: Router, private checkoutService: CheckoutService) {}

  ngOnInit(): void {
    this.items = this.checkoutService.getItems();
    this.total = this.checkoutService.getTotal();
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

    if (this.selectedPaymentMethod === 'creditCard') {
    } else if (this.selectedPaymentMethod === 'ewallet') {
    }

    this.showModalPopup('Success', 'Payment submitted!');
    setTimeout(() => this.router.navigate(['/product-list']), 2000); // Add delay to show the modal before navigation
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
