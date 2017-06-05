import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerListPage } from './customer-list';

@NgModule({
  declarations: [
    CustomerListPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerListPage),
  ],
  exports: [
    CustomerListPage
  ]
})
export class CustomerListPageModule {}
