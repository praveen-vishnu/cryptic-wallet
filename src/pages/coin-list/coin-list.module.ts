import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CoinListPage} from './coin-list';
import {PipesModule} from "../../pipes/pipes.module";
import {CoinListWalletPage} from "./coin-list-wallet";
import {IonicImageLoader} from "ionic-image-loader";
import {SocketIoConfig, SocketIoModule} from "ng-socket-io";

const config: SocketIoConfig = {url: 'wss://streamer.cryptocompare.com'};

@NgModule({
  declarations: [
    CoinListPage,
    CoinListWalletPage
  ],
  imports: [
    SocketIoModule.forRoot(config),
    IonicPageModule.forChild(CoinListPage),
    IonicPageModule.forChild(CoinListWalletPage),
    IonicImageLoader,
    PipesModule
  ],
})
export class CoinListPageModule {
}
