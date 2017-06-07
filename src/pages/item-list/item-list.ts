import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ItemProvider } from '../../providers/item/item';

@IonicPage({
  name: 'item-list'
})
@Component({
  selector: 'page-item-list',
  templateUrl: 'item-list.html',
})
export class ItemListPage {
  public itemList: Array<any>;

  constructor(public navCtrl: NavController, public itemProvider: ItemProvider) {}

  goToCreate(){ this.navCtrl.push('item-create'); }

  ionViewDidEnter() {
    this.itemProvider.getItemList().on('value', snapshot => {
      this.itemList = [];
      snapshot.forEach( snap => {
        this.itemList.push({
          id: snap.key,
          code: snap.val().code,
          name: snap.val().name,
        });
        return false;
      });
    });
  }
}