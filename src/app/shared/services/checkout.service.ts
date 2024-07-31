import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private items: any[] = [];
  private total: number = 0;

  setItems(items: any[], total: number): void {
    this.items = items;
    this.total = total;
  }

  getItems(): any[] {
    return this.items;
  }

  getTotal(): number {
    return this.total;
  }
}
