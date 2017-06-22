import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReturnListPage } from './return-list';

@NgModule({
  declarations: [
    ReturnListPage,
  ],
  imports: [
    IonicPageModule.forChild(ReturnListPage),
  ],
  exports: [
    ReturnListPage
  ]
})
export class ReturnListPageModule {}
