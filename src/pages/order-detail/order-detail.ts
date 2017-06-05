import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { Camera } from '@ionic-native/camera';

@IonicPage({
  name: 'order-detail',
  segment: 'order-detail/:orderId'
})
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  public currentOrder: any = {};
  public item:string = '';
  public qty:number = null;
  public orderItemList: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public orderProvider: OrderProvider, public cameraPlugin: Camera) {}

    ionViewDidEnter(){
      this.orderProvider.getOrderDetail(this.navParams.get('orderId'))
      .on('value', orderSnapshot => {
        this.currentOrder = orderSnapshot.val();
        this.currentOrder.id = orderSnapshot.key;

        //To get order items list
        this.orderProvider.getOrderItemList(orderSnapshot.key).on('value', snapshot => {
          this.orderItemList = [];
          snapshot.forEach( snap => {
            this.orderItemList.push({
              id: snap.key,
              item: snap.val().item,
              qty: snap.val().qty,
            });
            return false
          });
        });
      });


    }

    addItem(item, qty) {
      this.orderProvider.addItem(item, qty, this.currentOrder.id)
      .then(() => {
        this.item = '';
        this.qty = null;
      });
    }
}
