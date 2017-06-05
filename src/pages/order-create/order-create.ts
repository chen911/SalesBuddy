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

  public orderDate: String    = new Date().toISOString();
  public requestDate: String  = new Date().toISOString();

  constructor(public navCtrl: NavController, public orderProvider: OrderProvider) {  
  }

  createOrder(orderDate: string, requestDate: string, notes: string) {
    this.orderProvider.createOrder(orderDate, requestDate, notes)
    .then( newOrder => {
      this.navCtrl.pop();
    });
  }
}