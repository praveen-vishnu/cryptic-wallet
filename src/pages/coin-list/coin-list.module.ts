import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CoinListPage} from './coin-list';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    CoinListPage,
  ],
  imports: [
    IonicPageModule.forChild(CoinListPage),
    PipesModule
  ],
})
export class CoinListPageModule {
}
