import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { CustomerProvider } from "../../providers/customer/customer";

@IonicPage({
  name: 'order-list'
})
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {
  public customerRef:{}; 
  public orderList: Array<any>;

  constructor(public navCtrl: NavController, 
              public orderProvider: OrderProvider, 
              public customerProvider: CustomerProvider) {}

  ionViewDidEnter() {
    this.orderProvider.getOrderList().on('value', snapshot => {
      this.orderList = [];
      snapshot.forEach( snap => {
        this.orderList.push({
          id: snap.key,
          orderNo: snap.val().orderNo,
          orderDate: snap.val().orderDate,
          requestDate: snap.val().requestDate,
          notes: snap.val().notes,
          customer: snap.val().customer
        });
        return false
      });
    });
  }

  goToOrderDetail(orderId){
    this.navCtrl.push('order-detail', { 'orderId': orderId });
  }
  
  getCustomerName(customerId): string{
    if(customerId){
      this.customerProvider.getCustomerDetail(customerId)
      .on('value', customerSnapshot => {
        return customerSnapshot.val().name;
      });
    }

    return;
  }
}