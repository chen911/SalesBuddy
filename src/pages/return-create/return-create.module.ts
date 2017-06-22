import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReturnCreatePage } from './return-create';

@NgModule({
  declarations: [
    ReturnCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(ReturnCreatePage),
  ],
  exports: [
    ReturnCreatePage
  ]
})
export class ReturnCreatePageModule {}
