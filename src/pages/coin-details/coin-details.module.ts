import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CoinDetailsPage} from './coin-details';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    CoinDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CoinDetailsPage),
    PipesModule,
    ComponentsModule,
  ],
})
export class CoinDetailsPageModule {
}
