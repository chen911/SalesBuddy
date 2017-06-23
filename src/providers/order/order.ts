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
      orderNo: '',
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
  
  updateItem(qty, orderItemId, orderId): firebase.Promise<any> {
    return this.userProfileRef.child('/orderList').child(orderId).child('itemList').child(orderItemId)
    .push({
      qty: qty
    })
    .then( newItem => {
      this.userProfileRef.child('/orderList').child(orderId).child('itemList').child(orderItemId)
      .transaction( orderItem => {
        orderItem.qty = qty;
        return orderItem;
      });
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
  var records;
    
  firebase.database().ref('APP-ORDER-NO')
  .once('value')
  .then(snapshot => {
   records = snapshot.val() + 1;
    console.log('current records: ', records);
    // return records;
    snapshot.update(records);
  })
  .catch(error => console.log(error));

    // var orderno;
    // var orderNoRef = firebase.database().ref('/APP-ORDER-NO');
    // orderNoRef.on('value', function(snapshot) {
    //   orderno = snapshot.val() + 1;
    //   firebase.database().ref('/APP-ORDER-NO').push().setValue(orderno);
    // });

    // var order = 0;
    // firebase.database().ref('/APP-ORDER-NO')
    // .push({ })
    // .then((newOrder) => {
    //   firebase.database().ref('/APP-ORDER-NO').transaction( orderNO => {
    //     orderNO = orderNO + 1;
    //     order = orderNO;
    //   });
    // });
     return records;
  }
}
