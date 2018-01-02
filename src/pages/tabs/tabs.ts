import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SettingsPage} from "../settings/settings";
import {WalletPage} from "../wallet/wallet";
import {CoinListPage} from "../coin-list/coin-list";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root = CoinListPage;
  tab2Root = WalletPage;
  tab3Root = SettingsPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
