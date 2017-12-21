import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiService} from "../../app/services/api.service";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {Coin} from "../../app/coin";

/**
 * Generated class for the CoinListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coin-list',
  templateUrl: 'coin-list.html',
})
export class CoinListPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiService,
              private iab: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoinListPage');
    this.apiService.getCoinList();
  }

  get coins(): Array<Coin> {
    return this.apiService.coinList;
  }

  openLink(url): void {
    this.iab.create(url);
  }

  trackByCoin(index, item) {
    return index; // or item.id
  }

}
