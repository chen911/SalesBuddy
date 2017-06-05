import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomerProvider } from '../../providers/customer/customer';
import { Camera } from '@ionic-native/camera';

@IonicPage({
  name: 'customer-detail',
  segment: 'customer-detail/:customerId'
})
@Component({
  selector: 'page-customer-detail',
  templateUrl: 'customer-detail.html',
})
export class CustomerDetailPage {
  public currentCustomer: any = {};
  public guestName:string = '';
  public guestPicture:string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public customerProvider: CustomerProvider, public cameraPlugin: Camera) {}

    ionViewDidEnter(){
      this.customerProvider.getCustomerDetail(this.navParams.get('customerId'))
      .on('value', customerSnapshot => {
        this.currentCustomer = customerSnapshot.val();
        this.currentCustomer.id = customerSnapshot.key;
      });
    }

}
