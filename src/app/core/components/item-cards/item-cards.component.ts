import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../../shared/services/cart.service';

@Component({
  selector: 'app-item-cards',
  standalone: true,
  imports: [],
  templateUrl: './item-cards.component.html',
  styleUrl: './item-cards.component.css'
})
export class ItemCardsComponent {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() description: string = '';
  @Input() price: string = '';
  @Input() image: string = '';

  constructor(private cartService: CartService) {}

  addToCart() {
    const product = {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      image: this.image
    };
    this.cartService.addToCart(product);
    window.location.reload();
  }
}