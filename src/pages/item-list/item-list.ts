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
  public loadedItemList:Array<any>;

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

      this.loadedItemList = this.itemList;
    });
  }

    initializeItems(){
    this.itemList = this.loadedItemList;
  }

  searchItem(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();
    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;
    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.itemList = this.itemList.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1 
              || (v.code && v.code.toLowerCase().indexOf(q.toLowerCase()) > -1)) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.itemList.length);
  }
}