import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { CustomerProvider } from '../../providers/customer/customer';
import { Camera } from '@ionic-native/camera';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ItemProvider } from "../../providers/item/item";

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
  public currentCustomer: any = {};
  public item: string = '';
  public qty: number = null;
  public orderItemList: Array<any>;
  public itemList: Array<any>;
  private itemForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public orderProvider: OrderProvider, public cameraPlugin: Camera,
    public customerProvider: CustomerProvider,
    public itemProvider: ItemProvider,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController) {

    this.itemForm = this.formBuilder.group({
      item: ['', Validators.required],
      qty: ['', Validators.required],
    });

    //item list initialize
    this.itemProvider.getItemList().on('value', snapshot => {
      this.itemList = [];
      snapshot.forEach(snap => {
        this.itemList.push({
          id: snap.key,
          code: snap.val().code,
          name: snap.val().name,
        });
        return false;
      });
    });
  }

  ionViewDidEnter() {
    this.orderProvider.getOrderDetail(this.navParams.get('orderId'))
      .on('value', orderSnapshot => {
        this.currentOrder = orderSnapshot.val();
        this.currentOrder.id = orderSnapshot.key;

        if (orderSnapshot.val().customer) {
          this.currentCustomer = this.customerProvider.getCustomerDetail(orderSnapshot.val().customer);
        }

        //To get order items list
        this.orderProvider.getOrderItemList(orderSnapshot.key).on('value', snapshot => {
          this.orderItemList = [];
          snapshot.forEach(snap => {
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

  goToSave() {
    this.navCtrl.setRoot('order-list');
  }


  goToEditItem(item) {
    let alert = this.alertCtrl.create({
      title: 'Edit Item',
      subTitle: item.item,
      inputs: [
        {
          name: 'qty',
          placeholder: item.qty,
          value: item.qty,
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Update',
          handler: data => {
            if (data.qty) {
              this.orderProvider.updateItem(data.qty, item.id, this.currentOrder.id);
            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }


  goToDeleteItem(itemId) {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.orderProvider.deleteItem(itemId, this.currentOrder.id);
          }
        }
      ]
    });
    alert.present();
  }
}
