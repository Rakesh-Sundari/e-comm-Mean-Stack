import { Component, inject } from '@angular/core';
import { Order } from '../../types/order';
import { OrderService } from '../../services/order.service';
import { Product } from '../../types/product';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-orders',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.scss'
})
export class CustomerOrdersComponent {
  orders:Order[]=[];
  orderService=inject(OrderService);

  ngOnInit(){
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getCustomerOrders().subscribe((result)=>{
      this.orders=result;
      console.log(this.orders);
    });
  }

  sellingPrice(product: Product): number {
      if (!product) return 0;
  
      const price = Number(product.Price);
      const discount = Number(product.discount);
  
      return Math.round(price - (price * discount) / 100);
    }

  canCancelOrder(order: Order): boolean {
    // Customer can only cancel orders that are still in progress/processing
    const status = order.status?.toString().toLowerCase();
    return status === 'processing' || status === 'inprogress';
  }

  cancelOrder(order: Order) {
    if (!order._id) return;
    
    if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      this.orderService.cancelOrder(order._id).subscribe({
        next: (response) => {
          console.log('Order cancelled successfully:', response);
          alert('Order cancelled successfully!');
          // Reload orders to show updated status
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          let errorMessage = 'Failed to cancel order. Please try again.';
          
          if (error.error?.error) {
            errorMessage = error.error.error;
          } else if (error.status === 400) {
            errorMessage = 'This order cannot be cancelled (may already be shipped or delivered).';
          } else if (error.status === 403) {
            errorMessage = 'You do not have permission to cancel this order.';
          } else if (error.status === 404) {
            errorMessage = 'Order not found.';
          }
          
          alert(errorMessage);
        }
      });
    }
  }
}
