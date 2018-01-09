import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiService} from "../../services/api.service";
import {CoinDetailsPage} from "../coin-details/coin-details";
import {Storage} from "@ionic/storage";
import {Utils} from "../../classes/utils";

@IonicPage()
@Component({
  selector: 'page-coin-list',
  templateUrl: 'coin-list.html',
})
export class CoinListPage {
  search: boolean = false;
  coins: any;
  sorter: any = 'popular';
  sorters: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public apiService: ApiService) {
    this.apiService.coinList.subscribe(coinList => {
      this.coins = coinList;
      this.sortList(this.sorter);
      this.storage.set('coin-list', coinList);
    });
  }

  ionViewDidEnter() {
    this.storage.get('coin-list').then(list => {
      !list ? this.apiService.getCoinList() : this.coins = list;
    });
    this.setSorters();
  }

  setSorters() {
    this.sorters = [
      {
        name: 'Popular',
        value: 'popular'
      },
      {
        name: 'Price',
        value: 'price'
      },
      {
        name: 'Market Cap',
        value: 'marketcap'
      },
    ];
  }

  sorterChanged(event) {
    this.sortList(event);
  }

  sortList(sorter) {
    switch (sorter) {
      case 'popular':
        this.coins.sort(Utils.compareOrder);
        break;
      case 'price':
        this.coins.sort(Utils.comparePrices);
        break;
      case 'marketcap':
        this.coins.sort(Utils.compareMarketCap);
        break;
      default:
        this.coins.sort(Utils.compareOrder);
        break;
    }
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
