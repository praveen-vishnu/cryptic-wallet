import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AltfolioPage } from './altfolio';

@NgModule({
  declarations: [
    AltfolioPage,
  ],
  imports: [
    IonicPageModule.forChild(AltfolioPage),
  ],
})
export class AltfolioPageModule {}
