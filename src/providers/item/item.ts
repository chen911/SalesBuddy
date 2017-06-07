import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ItemProvider {
  public itemRef:firebase.database.Reference;

  constructor() {
    this.itemRef = firebase.database().ref('/item');
  }

  getItemList(): firebase.database.Reference {
    return this.itemRef;
  }

  getItemDetail(itemId:string): firebase.database.Reference {
    return this.itemRef.child(itemId);
  }
}
