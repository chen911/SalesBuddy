import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class UtilsProvider {
  
  constructor() {}

  public getNextCustomerNumber(): any {
    // firebase.database().ref('/APP-CUSTOMER-NO').on('value', custNo => {
    //     return custNo.val();
    // });
    firebase.database().ref('/APP-CUSTOMER-NO')
            .transaction( custNo => {
                custNo.key = custNo.key + 1;
                return custNo.key;
            });

    return;
  }

  getNextOrderNumber(): string {
    firebase.database().ref('/APP-ORDER-NO').on('value', orderNo => {
        return orderNo.val();
    });
    return;
  }
}