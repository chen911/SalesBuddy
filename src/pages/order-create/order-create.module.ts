import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderCreatePage } from './order-create';

@NgModule({
  declarations: [
    OrderCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(OrderCreatePage),
  ],
  exports: [
    OrderCreatePage
  ]
})
export class OrderCreatePageModule {}
