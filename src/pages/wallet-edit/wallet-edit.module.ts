import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {WalletEditPage} from './wallet-edit';

@NgModule({
  declarations: [
    WalletEditPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletEditPage),
  ],
})
export class WalletEditPageModule {
}
