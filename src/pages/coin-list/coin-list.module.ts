import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CoinListPage} from './coin-list';
import {PipesModule} from "../../pipes/pipes.module";
import {CoinListWalletPage} from "./coin-list-wallet";
import {IonicImageLoader} from "ionic-image-loader";

@NgModule({
  declarations: [
    CoinListPage,
    CoinListWalletPage
  ],
  imports: [
    IonicPageModule.forChild(CoinListPage),
    IonicPageModule.forChild(CoinListWalletPage),
    IonicImageLoader,
    PipesModule
  ],
})
export class CoinListPageModule {
}
