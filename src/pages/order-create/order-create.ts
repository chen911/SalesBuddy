import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { CustomerProvider } from '../../providers/customer/customer';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@IonicPage({
  name: 'order-create'
})
@Component({
  selector: 'page-order-create',
  templateUrl: 'order-create.html',
})
export class OrderCreatePage {
  public orderForm: FormGroup;
  public customerList: Array<any>;

  constructor(public navCtrl: NavController, 
              public orderProvider: OrderProvider,  
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

    this.orderForm = formBuilder.group({
        customer: ['', Validators.compose([Validators.required])],
        orderDate: [new Date().toISOString(), Validators.compose([Validators.required])],
        requestDate: [new Date().toISOString(), Validators.compose([Validators.required])],
        notes: ['']
      });
  }

  createOrder() {
    this.orderProvider.createOrder( this.orderForm.value.orderDate, 
                                    this.orderForm.value.requestDate, 
                                    this.orderForm.value.notes, 
                                    this.orderForm.value.customer)
    .then( newOrder => {
      // this.navCtrl.pop();
      this.navCtrl.setRoot('order-detail', { 'orderId': newOrder.key, 'newOrder': true });
    });
  }
}