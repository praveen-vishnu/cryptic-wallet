import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CoinListPage} from './coin-list';
import {PipesModule} from "../../pipes/pipes.module";
import {CoinListWalletPage} from "./coin-list-wallet";

@NgModule({
  declarations: [
    CoinListPage,
    CoinListWalletPage
  ],
  imports: [
    IonicPageModule.forChild(CoinListPage),
    IonicPageModule.forChild(CoinListWalletPage),
    PipesModule
  ],
})
export class CoinListPageModule {
}
