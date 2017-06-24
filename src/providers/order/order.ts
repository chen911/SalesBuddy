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

  getOrderItemList(orderId): firebase.database.Reference {
    return this.userProfileRef.child('/orderList').child(orderId).child('/itemList');
  }

  getOrderDetail(orderId:string): firebase.database.Reference {
    return this.userProfileRef.child('/orderList').child(orderId);
  }

  createOrder(orderDate: string, requestDate: string, notes: string, customer: string): firebase.Promise<any> {
    if(!notes) {
      notes="";
    }
    return this.userProfileRef.child('/orderList').push({
      orderDate: orderDate,
      requestDate: requestDate,
      notes: notes,
      customer: customer,
      orderNo: this.getNextOrderNumber(),
      createdDate: new Date().toISOString()
    });
  }

  addItem(item, qty, orderId): firebase.Promise<any> {
    return this.userProfileRef.child('/orderList').child(orderId).child('itemList')
    .push({
      item: item,
      qty: qty
    })
    .then((newItem) => {
      this.userProfileRef.child('/orderList').child(orderId).transaction( order => {
        // order.revenue += orderPrice;
        return order;
      });
    });
  }
  
  deleteItem(itemId, orderId){
    this.userProfileRef.child('/orderList').child(orderId).child('/itemList').child(itemId).remove();
  }
  
  updateItem(qty, orderItemId, orderId) {

    this.userProfileRef.child('/orderList').child(orderId).child('itemList').child(orderItemId)
      .transaction( orderItem => {
        orderItem.qty = qty;
        return orderItem;
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

  getNextOrderNumber(): number{
    var orderNumber  : number = 1;
    var idreg;
    
    this.userProfileRef.child('/idreg').on("value", function(snapshot) {
      idreg = snapshot.val();
    });

    if(idreg) {
      orderNumber = idreg.APP_ORDER_NO + 1;

      //update ID value
      this.userProfileRef.child('/idreg').transaction( idregd => { 
        idregd.APP_ORDER_NO = orderNumber;
        return idregd;
      });
    } else {
      this.userProfileRef.child('/idreg').set({
      // this.userProfileRef.child('/idreg').push({
        APP_ORDER_NO: 1,
        APP_RETURN_NO: 1
      });
    }

    return orderNumber;
  }

  submit(orderId) {
    this.userProfileRef.child('/orderList').child(orderId)
    .transaction( order => { 
      order.submitted= true
      return order;
    });
  }
}
