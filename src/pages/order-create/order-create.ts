import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';

@IonicPage({
  name: 'order-create'
})
@Component({
  selector: 'page-order-create',
  templateUrl: 'order-create.html',
})
export class OrderCreatePage {

  constructor(public navCtrl: NavController, public orderProvider: OrderProvider) {}

  createOrder(orderDate: string, requestDate: string, orderName: string, orderPrice: number, orderCost: number) {
    this.orderProvider.createOrder(orderDate, requestDate, orderName, orderPrice, orderCost)
    .then( newOrder => {
      this.navCtrl.pop();
    });
  }
}