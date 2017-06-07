import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { CustomerProvider } from '../../providers/customer/customer';

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
  public customerList: Array<any>;

  constructor(public navCtrl: NavController, 
      public orderProvider: OrderProvider,  
      public customerProvider: CustomerProvider) 
  {
    this.customerProvider.getCustomerList().on('value', snapshot => {
      this.customerList = [];
      snapshot.forEach( snap => {
        this.customerList.push({
          id: snap.key,
          code: snap.val().code,
          name: snap.val().name,
        });
        return false;
      });
    });
  }

  createOrder(orderDate: string, requestDate: string, notes: string, customer: string) {
    this.orderProvider.createOrder(orderDate, requestDate, notes, customer)
    .then( newOrder => {
      this.navCtrl.pop();
    });
  }
}