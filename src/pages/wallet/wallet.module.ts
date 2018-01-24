import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {WalletPage} from './wallet';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";
import {IonicImageLoader} from "ionic-image-loader";

@NgModule({
  declarations: [
    WalletPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletPage),
    PipesModule,
    IonicImageLoader,
    ComponentsModule,
  ],
})
export class WalletPageModule {
}
