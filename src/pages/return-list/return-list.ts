import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ReturnProvider } from '../../providers/return/return';
import { CustomerProvider } from "../../providers/customer/customer";

@IonicPage({
  name: 'return-list'
})
@Component({
  selector: 'page-return-list',
  templateUrl: 'return-list.html',
})
export class ReturnListPage {
  public customerRef:{}; 
  public returnList: Array<any>;

  constructor(public navCtrl: NavController, 
              public returnProvider: ReturnProvider, 
              public customerProvider: CustomerProvider) {}

  ionViewDidEnter() {
    this.returnProvider.getReturnList().on('value', snapshot => {
      this.returnList = [];
      snapshot.forEach( snap => {
        this.returnList.push({
          id: snap.key,
          returnNo: snap.val().returnNo,
          returnDate: snap.val().returnDate,
          originalOrderDate: snap.val().requestDate,
          originalOrderNumber: snap.val().originalOrderNumber,
          notes: snap.val().notes,
          customer: snap.val().customer
        });
        return false
      });
    });
  }

  goToReturnDetail(returnId){
    this.navCtrl.push('return-detail', { 'returnId': returnId });
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