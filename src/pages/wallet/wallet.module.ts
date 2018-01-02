import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {WalletPage} from './wallet';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    WalletPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletPage),
    PipesModule,
    ComponentsModule,
  ],
})
export class WalletPageModule {
}
