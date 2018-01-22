import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, VirtualScroll} from 'ionic-angular';
import {ApiService} from "../../services/api.service";
import {CoinDetailsPage} from "../coin-details/coin-details";
import {Storage} from "@ionic/storage";
import {Utils} from "../../classes/utils";
import {Coin} from "../../interfaces/coin";

@IonicPage()
@Component({
  selector: 'page-coin-list',
  templateUrl: 'coin-list.html',
})
export class CoinListPage {
  search: boolean = false;
  coins: Array<Coin> = [];
  favorites: Array<Coin> = [];
  list: Array<Coin> = [];
  listView: any;
  coinsSearchList: any;
  sorter: any = 'popular';
  sorters: any;

  @ViewChild(VirtualScroll) virtualList: VirtualScroll;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public apiService: ApiService) {
    this.apiService.coinList.subscribe(coinList => {
      this.coins = this.coinsSearchList = coinList;
      this.sortList(this.sorter);
      this.storage.set('coin-list', coinList);
    });
  }

  ionViewDidLoad() {
    this.listView = 'favorites';
    this.list = this.favorites;
    this.storage.get('coin-list').then(list => {
      list ? this.coins = this.coinsSearchList = list : this.apiService.getCoinList();
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

  coinsViewChanged(event) {

  }

  filterCoinsOnSearch(event) {
    this.coinsSearchList = this.coins;
    let value = event.target.value;

    if (value && value.trim() != '') {
      this.coinsSearchList = this.coinsSearchList.filter((item) => {
        return (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      })
    }
  }

  sorterChanged(event) {
    this.sortList(event);
  }

  listChanged(event) {
    this.list = [];
    switch (event.value) {
      case 'favorites':
        this.list = this.favorites;
        break;
      case 'coins':
        this.list = this.coins;
        break;
      default:
        this.list = this.coins;
        break;
    }
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
    return item.name;
  }

  detectChange(priceChange): boolean {
    return priceChange < 0;
  }

  doRefresh(refresher) {
    this.apiService.refreshCoinList(refresher);
  }

  addToFavorites(item, coin) {
    this.favorites.push(coin);
    this.list = this.coins = this.coins.filter(item => item.name !== coin.name);
    item.close();
  }
}
