import {Component, ViewChild} from '@angular/core';
import {Content, IonicPage, NavController, NavParams, Searchbar, VirtualScroll} from 'ionic-angular';
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
  allCoins: Array<Coin> = [];
  coinsSearchList: any;
  sorter: any = 'popular';
  sorters: any;
  searchBarHeight: number;

  @ViewChild(VirtualScroll) virtualList: VirtualScroll;
  @ViewChild(Content) content: Content;
  @ViewChild(Searchbar) searchBar: Searchbar;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public apiService: ApiService) {
    this.apiService.coinList.subscribe(coinList => {
      this.allCoins = this.coinsSearchList = this.coins = coinList;
      this.sortList(this.sorter);
      this.storage.set('coin-list', coinList);
      this.hideSearchBar();
    });
  }

  ionViewDidLoad() {
    this.searchBarHeight = this.searchBar.getNativeElement().clientHeight;
    this.storage.get('coin-list').then(list => {
      list ? this.allCoins = this.coinsSearchList = this.coins = list : this.apiService.getCoinList();
      this.hideSearchBar();
    });
    this.setSorters();
  }

  private hideSearchBar() {
    this.content.scrollTo(0, this.searchBarHeight, 400);
  }

  // onScrollEnd(event) {
  //   if (!!event && !!event.scrollTop) {
  //     setTimeout(() => {
  //       console.log(event);
  //       if (event.scrollTop < (this.searchBarHeight / 2)) {
  //         this.content.scrollTo(0, 0, 400);
  //       }
  //       if (event.scrollTop >= (this.searchBarHeight / 2) && event.scrollTop <= this.searchBarHeight) {
  //         this.content.scrollTo(0, this.searchBarHeight, 400);
  //       }
  //     }, 300);
  //   }
  // }

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

  filterCoinsOnSearch(event) {
    this.allCoins = this.coinsSearchList;
    let value = event.target.value;

    if (value && value.trim() != '') {
      this.allCoins = this.allCoins.filter((item) => {
        return (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      })
    }
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
    return this.allCoins ? this.allCoins.length.toString() : '0';
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
    this.coins[this.coins.indexOf(coin)].favorite = true;
    this.favorites.push(coin);
    this.favorites.sort(Utils.compareOrder);
    this.coins = this.coins.filter(originalCoin => originalCoin.name !== coin.name);
    // console.log(this.coins);

    // console.log(this.favorites);
    this.allCoins = this.favorites.concat(this.coins);

    // console.log(this.allCoins);

    // this.virtualList.writeUpdate(true);
    // this.virtualList.renderVirtual(true);

    // let tester = this.coins;
    // this.coins = this.coins.filter(originalCoin => {
    //   return originalCoin.code !== coin.code;
    // });
    //
    // this.coins = [];

    item.close();
  }
}
