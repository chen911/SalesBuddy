import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';

@IonicPage({
  name: 'order-list'
})
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {
  public orderList: Array<any>;

  constructor(public navCtrl: NavController, public orderProvider: OrderProvider) {}

  ionViewDidEnter() {
    this.orderProvider.getOrderList().on('value', snapshot => {
      this.orderList = [];
      snapshot.forEach( snap => {
        this.orderList.push({
          id: snap.key,
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

}