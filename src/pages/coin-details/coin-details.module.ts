import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoinDetailsPage } from './coin-details';

@NgModule({
  declarations: [
    CoinDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CoinDetailsPage),
  ],
})
export class CoinDetailsPageModule {}
