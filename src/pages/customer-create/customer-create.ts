import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CustomerProvider } from '../../providers/customer/customer';

@IonicPage({
  name: 'customer-create'
})
@Component({
  selector: 'page-customer-create',
  templateUrl: 'customer-create.html',
})
export class CustomerCreatePage {

  constructor(public navCtrl: NavController, public customerProvider: CustomerProvider) {}

  createCustomer(code: string, name: string, addressLine1: string, addressLine2: string, addressLine3: string) {
    this.customerProvider.createCustomer(code, name, addressLine1, addressLine2, addressLine3)
    .then( newCustomer => {
      this.navCtrl.pop();
    });
  }
}