import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';
import { Form, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { OrderService } from '../../services/order.service';
import { Order } from '../../types/order';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatRadioModule, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent {

  cartServie = inject(CartService);

  ngOnInit() {
    this.cartServie.init();
  }
  get cartItems() {
    return this.cartServie.items;
  }

  sellingPrice(product: Product): number {
    if (!product) return 0;

    const price = Number(product.Price);
    const discount = Number(product.discount);

    return Math.round(price - (price * discount) / 100);
  }


  addToCart(productId: String, quantity: number) {
    this.cartServie.addToCart(productId, quantity).subscribe(result => {
      this.cartServie.init();
    })
  }
  get totalAmount() {
    let amount = 0;
    for (let index = 0; index < this.cartItems.length; index++) {
      const element = this.cartItems[index];
      amount += this.sellingPrice(element.product) * element.quantity;
    }

    return amount;
  }
  orderStep: number = 0;
  formbuilder = inject(FormBuilder);
  paymentType='cash';
  addressForm = this.formbuilder.group({
    address1: ['', Validators.required],
    address2: [''],
    city: ['', Validators.required],
    pincode: ['', Validators.required],
  });
  checkout() {
    this.orderStep = 1;
  }
  addAddress() {
    this.orderStep = 2;
  }

   router = inject(Router);
  orderService=inject(OrderService);
  completeOrder(){
    let order:Order={
      items:this.cartItems,
      paymentType:this.paymentType,
      address:this.addressForm.value,
      date:new Date(),
      
    };
    const result = window.confirm("Are you sure you want to proceed?");
    if(result){
      this.orderService.addOrder(order).subscribe((result)=>{
      alert("Your order is completed");
      this.cartServie.init();
      this.orderStep=0;
      this.router.navigateByUrl('orders');
    })
    }else{
      this.router.navigateByUrl('orders')
    }
    console.log(order);
  }
}
