import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class OrderProvider {
  public userProfileRef:firebase.database.Reference;
  constructor() {
    this.userProfileRef = firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}`);
  }

  getOrderList(): firebase.database.Reference {
    return this.userProfileRef.child('/orderList');
  }

  getOrderDetail(orderId:string): firebase.database.Reference {
    return this.userProfileRef.child('/orderList').child(orderId);
  }

  createOrder(orderDate: string, requestDate: string, orderName: string, orderPrice: number, orderCost: number): firebase.Promise<any> {
    return this.userProfileRef.child('/orderList').push({
      name: orderName,
      date: orderDate,
      price: orderPrice * 1,
      cost: orderCost * 1,
      revenue: orderCost * -1
    });
  }

  addGuest(guestName, orderId, orderPrice, guestPicture = null): firebase.Promise<any> {
    return this.userProfileRef.child('/orderList').child(orderId).child('guestList')
    .push({
      guestName: guestName
    })
    .then((newGuest) => {
      this.userProfileRef.child('/orderList').child(orderId).transaction( order => {
        order.revenue += orderPrice;
        return order;
      });
      if (guestPicture != null) {
        firebase.storage().ref('/guestProfile/').child(newGuest.key)
        .child('profilePicture.png').putString(guestPicture, 'base64', {contentType: 'image/png'})
        .then((savedPicture) => {
          this.userProfileRef.child('/orderList').child(orderId).child('guestList')
          .child(newGuest.key).child('profilePicture').set(savedPicture.downloadURL);
        });        
      }
    });
  }

}
