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
  public loadedCustomerList:Array<any>;

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
          addressLine2: snap.val().addressLine2,
          addressLine3: snap.val().addressLine3
        });
        return false;
      });

      this.loadedCustomerList = this.customerList;
    });
  }

  initializeCustomers(){
    this.customerList = this.loadedCustomerList;
  }

  searchCustomer(searchbar) {
    // Reset items back to all of the items
    this.initializeCustomers();
    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;
    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.customerList = this.customerList.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1 
              || (v.code && v.code.toLowerCase().indexOf(q.toLowerCase()) > -1)) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.customerList.length);

  }

  goToCustomerDetail(customerId){
    this.navCtrl.push('customer-detail', { 'customerId': customerId });
  }
}