import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiService} from "../../services/api.service";
import {CoinDetailsPage} from "../coin-details/coin-details";
import {Storage} from "@ionic/storage";
import {Currency} from "../../classes/currency";

@IonicPage()
@Component({
  selector: 'page-coin-list',
  templateUrl: 'coin-list.html',
})
export class CoinListPage {
  search: boolean = false;
  coins: any;
  currency: Currency;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public apiService: ApiService) {
    this.apiService.coinList.subscribe(coinList => {
      this.storage.set('coin-list', coinList);
      return this.coins = coinList;
    });

    this.apiService.storedCurrency.subscribe(item => {
      this.currency = item;
    })
  }

  ionViewDidEnter() {
    this.storage.get('coin-list').then(list => {
      !list ? this.apiService.getCoinList() : this.coins = list;
    });
  }

  get coinListLength(): string {
    return this.coins ? this.coins.length.toString() : '0';
  }

  get isLoading(): boolean {
    return this.apiService.isLoading;
  }

  selectedCoin(coin): void {
    this.navCtrl.push(CoinDetailsPage, coin);
  }

  getPrice(coin) {
    if (this.currency) {
      return coin.currencies[this.currency.code].price;
    }
    return '';
  }

  getChange(coin) {
    if (this.currency) {
      return coin.currencies[this.currency.code].change;
    }
    return '';
  }

  trackByCoin(index, item): number {
    return index; // or item.id
  }

  detectChange(priceChange): boolean {
    return priceChange < 0;
  }

  doRefresh(refresher) {
    this.apiService.refreshCoinList(refresher);
  }
}
