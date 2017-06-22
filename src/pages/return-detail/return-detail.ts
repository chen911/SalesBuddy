import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ReturnProvider } from '../../providers/return/return';
import { CustomerProvider } from '../../providers/customer/customer';
import { Camera } from '@ionic-native/camera';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ItemProvider } from "../../providers/item/item";

@IonicPage({
  name: 'return-detail',
  segment: 'return-detail/:returnId'
})
@Component({
  selector: 'page-return-detail',
  templateUrl: 'return-detail.html',
})
export class ReturnDetailPage {
  public currentReturn: any = {};
  public currentCustomer: any = {};
  public returnItemList: Array<any>;
  public itemList: Array<any>;
  private returnItemForm: FormGroup;
  public newReturn:boolean;
  public item: string = '';		
  public qty: number = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public returnProvider: ReturnProvider, public cameraPlugin: Camera,
    public customerProvider: CustomerProvider,
    public itemProvider: ItemProvider,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController) {
    

    this.returnItemForm = this.formBuilder.group({
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

    this.newReturn = this.navParams.get('newReturn');

    this.returnProvider.getReturnDetail(this.navParams.get('returnId'))
      .on('value', returnSnapshot => {
        this.currentReturn = returnSnapshot.val();
        this.currentReturn.id = returnSnapshot.key;

        if (returnSnapshot.val().customer) {
          this.currentCustomer = this.customerProvider.getCustomerDetail(returnSnapshot.val().customer);
        }

        //To get return items list
        this.returnProvider.getReturnItemList(returnSnapshot.key).on('value', snapshot => {
          this.returnItemList = [];
          snapshot.forEach(snap => {
            this.returnItemList.push({
              id: snap.key,
              item: snap.val().item,
              qty: snap.val().qty,
            });
            return false
          });
        });
      });
  }

  addItem() {
    this.returnProvider.addItem(this.returnItemForm.value.item, this.returnItemForm.value.qty, this.currentReturn.id)
      .then(() => {
        this.returnItemForm.reset();
      });
  }

  goToSave() {
    this.navCtrl.setRoot('return-list');
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
              this.returnProvider.updateItem(data.qty, item.id, this.currentReturn.id);
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
            this.returnProvider.deleteItem(itemId, this.currentReturn.id);
          }
        }
      ]
    });
    alert.present();
  }
}
