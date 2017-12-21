import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CoinListPage} from './coin-list';

@NgModule({
  declarations: [
    CoinListPage,
  ],
  imports: [
    IonicPageModule.forChild(CoinListPage),
  ],
})
export class CoinListPageModule {
}
