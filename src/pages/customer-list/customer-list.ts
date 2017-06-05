import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CustomerProvider } from '../../providers/customer/customer';

@IonicPage({
  name: 'customer-list'
})
@Component({
  selector: 'page-customer-list',
  templateUrl: 'customer-list.html',
})
export class CustomerListPage {
  public customerList: Array<any>;

  constructor(public navCtrl: NavController, public customerProvider: CustomerProvider) {}

  goToCreate(){ this.navCtrl.push('customer-create'); }

  ionViewDidEnter() {
    this.customerProvider.getCustomerList().on('value', snapshot => {
      this.customerList = [];
      snapshot.forEach( snap => {
        this.customerList.push({
          id: snap.key,
          code: snap.val().code,
          name: snap.val().name,
          addressLine1: snap.val().addressLine1,
          addressLine2: snap.val().addressLine1,
          addressLine3: snap.val().addressLine1
        });
        return false;
      });
    });
  }

  goToCustomerDetail(customerId){
    this.navCtrl.push('customer-detail', { 'customerId': customerId });
  }

}