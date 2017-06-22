import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CustomerProvider } from '../../providers/customer/customer';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@IonicPage({
  name: 'customer-create'
})
@Component({
  selector: 'page-customer-create',
  templateUrl: 'customer-create.html',
})
export class CustomerCreatePage {
  public customerForm: FormGroup;

  constructor(public navCtrl: NavController, 
              public customerProvider: CustomerProvider, 
              public formBuilder: FormBuilder) 
  {
      this.customerForm = formBuilder.group({
        name: ['', Validators.compose([Validators.required])],
        telephone: ['', Validators.compose([Validators.required])],
        contactPersonName: [''],
        addressLine1: [''],
        addressLine2: [''],
        addressLine3: ['']
      });
  }

  createCustomer() {
    this.customerProvider.createCustomer("",  this.customerForm.value.name, 
                                              this.customerForm.value.telephone, 
                                              this.customerForm.value.contactPersonName, 
                                              this.customerForm.value.addressLine1,
                                              this.customerForm.value.addressLine2, 
                                              this.customerForm.value.addressLine3)
      .then(newCustomer => {
        this.navCtrl.pop();
      });
  }
}