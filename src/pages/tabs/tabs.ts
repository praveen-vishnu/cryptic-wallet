import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AltfolioPage} from "../altfolio/altfolio";
import {SettingsPage} from "../settings/settings";
import {CoinDetailsPage} from "../coin-details/coin-details";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root = CoinDetailsPage;
  tab2Root = AltfolioPage;
  tab3Root = SettingsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
