import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ReturnProvider {
  public userProfileRef:firebase.database.Reference;

  constructor() {
    this.userProfileRef = firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}`);
  }

  getReturnList(): firebase.database.Reference {
    return this.userProfileRef.child('/returnList');
  }

  getReturnItemList(oReturnId): firebase.database.Reference {
    return this.userProfileRef.child('/returnList').child(oReturnId).child('/itemList');
  }

  getReturnDetail(oReturnId:string): firebase.database.Reference {
    return this.userProfileRef.child('/returnList').child(oReturnId);
  }

  createReturn( returnDate: string, 
                customer: string, 
                originalOrderNumber: string, 
                originalOrderDate: string, 
                notes: string): firebase.Promise<any> {
    if(!notes) {
      notes="";
    }
    return this.userProfileRef.child('/returnList').push({
      returnDate: returnDate,
      customer: customer,
      originalOrderNumber: originalOrderNumber,
      originalOrderDate: originalOrderDate,
      notes: notes,
    });
  }

  addItem(item, qty, oReturnId): firebase.Promise<any> {
    return this.userProfileRef.child('/returnList').child(oReturnId).child('itemList')
    .push({
      item: item,
      qty: qty
    })
    .then((newItem) => {
      this.userProfileRef.child('/returnList').child(oReturnId).transaction( oReturn => {
        // oReturn.revenue += oReturnPrice;
        return oReturn;
      });
    });
  }
  
  deleteItem(itemId, oReturnId){
    this.userProfileRef.child('/returnList').child(oReturnId).child('/itemList').child(itemId).remove();
  }
  
  updateItem(qty, oReturnItemId, oReturnId) {
    this.userProfileRef.child('/returnList').child(oReturnId).child('itemList').child(oReturnItemId)
    .transaction( oReturnItem => {
      oReturnItem.qty = qty;
      return oReturnItem;
    });
  }

  addGuest(guestName, oReturnId, oReturnPrice, guestPicture = null): firebase.Promise<any> {
    return this.userProfileRef.child('/returnList').child(oReturnId).child('guestList')
    .push({
      guestName: guestName
    })
    .then((newGuest) => {
      this.userProfileRef.child('/returnList').child(oReturnId).transaction( oReturn => {
        oReturn.revenue += oReturnPrice;
        return oReturn;
      });
      if (guestPicture != null) {
        firebase.storage().ref('/guestProfile/').child(newGuest.key)
        .child('profilePicture.png').putString(guestPicture, 'base64', {contentType: 'image/png'})
        .then((savedPicture) => {
          this.userProfileRef.child('/returnList').child(oReturnId).child('guestList')
          .child(newGuest.key).child('profilePicture').set(savedPicture.downloadURL);
        });        
      }
    });
  }

  getNextReturnNumber(): number{
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

    // var oReturnno;
    // var oReturnNoRef = firebase.database().ref('/APP-ORDER-NO');
    // oReturnNoRef.on('value', function(snapshot) {
    //   oReturnno = snapshot.val() + 1;
    //   firebase.database().ref('/APP-ORDER-NO').push().setValue(oReturnno);
    // });

    // var oReturn = 0;
    // firebase.database().ref('/APP-ORDER-NO')
    // .push({ })
    // .then((newReturn) => {
    //   firebase.database().ref('/APP-ORDER-NO').transaction( oReturnNO => {
    //     oReturnNO = oReturnNO + 1;
    //     oReturn = oReturnNO;
    //   });
    // });
     return records;
  }


  submit(returnId) {
    this.userProfileRef.child('/returnList').child(returnId)
    .transaction( oreturn => { 
      oreturn.submitted= true
      return oreturn;
    });
  }
}
