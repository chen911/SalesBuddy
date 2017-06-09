import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class CustomerProvider {
  public customerRef:firebase.database.Reference;
  public currentUser:firebase.User;

  constructor() {
    this.currentUser = firebase.auth().currentUser;
    this.customerRef = firebase.database().ref('/customer');
  }

  getCustomerList(): firebase.database.Reference {
    return this.customerRef;
  }

  getCustomerDetail(customerId:string): firebase.database.Reference {
    return this.customerRef.child(customerId);
  }

  createCustomer(code: string, name: string, addressLine1: string, addressLine2: string, addressLine3: string): firebase.Promise<any> {
    if(!code) {
      code="";
    }
    if(!addressLine1) {
      addressLine1="";
    }
    if(!addressLine2) {
      addressLine2="";
    }
    if(!addressLine3) {
      addressLine3="";
    }
    return this.customerRef.push({
      code: code,
      name: name,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      addressLine3: addressLine3,
      createdUser: this.currentUser.uid,
      createdDate: new Date().toISOString()
    });
  }
}
