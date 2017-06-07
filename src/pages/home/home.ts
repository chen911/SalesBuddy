import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {}

  goToProfile(){ this.navCtrl.push('profile'); }

  goToCreate(){ this.navCtrl.push('event-create'); }

  goToOrderCreate(){ this.navCtrl.push('order-create'); }

  goToList(){ this.navCtrl.push('event-list'); }

  goToOrderList(){ this.navCtrl.push('order-list'); }

  goToCustomerList(){ this.navCtrl.push('customer-list'); }

  goToItemList(){ this.navCtrl.push('item-list'); }
}
