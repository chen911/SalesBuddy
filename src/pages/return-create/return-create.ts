import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ReturnProvider } from '../../providers/return/return';
import { CustomerProvider } from '../../providers/customer/customer';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@IonicPage({
  name: 'return-create'
})
@Component({
  selector: 'page-return-create',
  templateUrl: 'return-create.html',
})
export class ReturnCreatePage {
  public returnForm: FormGroup;
  public customerList: Array<any>;

  constructor(public navCtrl: NavController, 
              public returnProvider: ReturnProvider,  
              public customerProvider: CustomerProvider,
              public formBuilder: FormBuilder) 
  {
    this.customerProvider.getCustomerList().on('value', snapshot => {
      this.customerList = [];
      snapshot.forEach( snap => {
        this.customerList.push({
          id: snap.key,
          code: snap.val().code,
          name: snap.val().name,
        });
        return false;
      });
    });

    this.returnForm = formBuilder.group({
        customer: ['', Validators.compose([Validators.required])],
        returnDate: [new Date().toISOString(), Validators.compose([Validators.required])],
        originalOrderNumber: [''],
        originalOrderDate: [''],
        notes: ['']
      });
  }

  createReturn() {
    this.returnProvider.createReturn( this.returnForm.value.returnDate, 
                                    this.returnForm.value.customer, 
                                    this.returnForm.value.originalOrderNumber, 
                                    this.returnForm.value.originalOrderDate, 
                                    this.returnForm.value.notes)
    .then( newReturn => {
      // this.navCtrl.pop();
      this.navCtrl.setRoot('return-detail', { 'returnId': newReturn.key, 'newReturn': true });
    });
  }
}