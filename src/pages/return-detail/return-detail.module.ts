import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReturnDetailPage } from './return-detail';

@NgModule({
  declarations: [
    ReturnDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ReturnDetailPage),
  ],
  exports: [
    ReturnDetailPage
  ]
})
export class ReturnDetailPageModule {}
