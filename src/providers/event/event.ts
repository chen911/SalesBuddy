import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class EventProvider {
  public userProfileRef:firebase.database.Reference;
  constructor() {
    this.userProfileRef = firebase.database().ref(`userProfile/${firebase.auth().currentUser.uid}`);
  }

  getEventList(): firebase.database.Reference {
    return this.userProfileRef.child('/eventList');
  }

  getEventDetail(eventId:string): firebase.database.Reference {
    return this.userProfileRef.child('/eventList').child(eventId);
  }

  createEvent(eventName: string, eventDate: string, eventPrice: number, 
    eventCost: number): firebase.Promise<any> {
    return this.userProfileRef.child('/eventList').push({
      name: eventName,
      date: eventDate,
      price: eventPrice * 1,
      cost: eventCost * 1,
      revenue: eventCost * -1
    });
  }

  addGuest(guestName, eventId, eventPrice, guestPicture = null): firebase.Promise<any> {
    return this.userProfileRef.child('/eventList').child(eventId).child('guestList')
    .push({
      guestName: guestName
    })
    .then((newGuest) => {
      this.userProfileRef.child('/eventList').child(eventId).transaction( event => {
        event.revenue += eventPrice;
        return event;
      });
      if (guestPicture != null) {
        firebase.storage().ref('/guestProfile/').child(newGuest.key)
        .child('profilePicture.png').putString(guestPicture, 'base64', {contentType: 'image/png'})
        .then((savedPicture) => {
          this.userProfileRef.child('/eventList').child(eventId).child('guestList')
          .child(newGuest.key).child('profilePicture').set(savedPicture.downloadURL);
        });        
      }
    });
  }

}
