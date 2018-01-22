import {Component, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Content, IonicPage, Item, ItemSliding, NavController, NavParams, VirtualScroll} from 'ionic-angular';
import {ApiService} from "../../services/api.service";
import {CoinDetailsPage} from "../coin-details/coin-details";
import {Storage} from "@ionic/storage";
import {Utils} from "../../classes/utils";
import {Coin} from "../../interfaces/coin";

const SORTERS = [
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
  sorter: any;
  sorters: any = SORTERS;
  listLoaded: boolean = false;
  searchTerm: string = '';

  @ViewChild(VirtualScroll) virtualList: VirtualScroll;
  @ViewChild(Content) content: Content;
  @ViewChildren(ItemSliding) itemSlidings: QueryList<ItemSliding>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public apiService: ApiService) {
    this.apiService.coinList.subscribe(coinList => {
      this.coins = this.removeFavorites(coinList);
      if (this.isCoinsView()) {
        this.list = this.coins;
      }
      this.sortList(this.sorter);
      this.storage.set('coin-list', coinList);
    });
  }

  ionViewDidLoad() {
    this.listView = 'favorites';
    this.list = this.favorites;
    this.retrieveFavoritesFromStorage();
    this.retrieveSorterFromStorage();
  }

  get listIsEmpty(): boolean {
    if (this.listLoaded) {
      return !this.isCoinsView() && this.list.length === 0;
    }
    return false;
  }

  goToAllCoins() {
    this.listView = 'coins';
    setTimeout(() => {
      this.openItem(this.itemSlidings.first, this.itemSlidings.first.item);
    }, 1500);
  }

  private retrieveSorterFromStorage() {
    this.storage.get('sorter').then(sorter => {
      sorter ? this.sorter = sorter : this.sorter = 'popular';
    });
  }

  private retrieveFavoritesFromStorage() {
    this.storage.get('favorites').then(list => {
      list ? this.list = this.favorites = list : [];
      this.sortList(this.sorter);
      this.retrieveCoinsFromStorage();
    });
  }

  private retrieveCoinsFromStorage() {
    this.storage.get('coin-list').then(list => {
      if (list) {
        list = this.removeFavorites(list);
        this.coins = list;
        this.sortList(this.sorter);
      } else {
        this.apiService.getCoinList();
      }
      this.listLoaded = true;
    });
  }

  private removeFavorites(list) {
    return list.filter(coin => {
      return !this.favorites.some(favorite => favorite.name === coin.name);
    });
  }

  private isCoinsView(): boolean {
    return this.listView === 'coins';
  }

  coinsViewChanged(event) {

  }

  filterCoinsOnSearch(event) {
    this.coinsSearchList = this.coins;
    let value = event.target.value;

    if (value && value.trim() != '') {
      this.list = this.coinsSearchList.filter((item) => {
        return (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      });
    } else {
      this.list = this.coins;
    }
  }

  getVisibility(): string {
    return this.list.length > 0 ? 'visible' : 'hidden';
  }

  sorterChanged(event) {
    this.sortList(event);
    this.storage.set('sorter', event);
  }

  listChanged(event) {
    this.list = [];
    this.updateVirtualList(() => {
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
    });
    this.sortList(this.sorter);
    this.content.scrollToTop();
    // console.log()
  }

  updateVirtualList(callBack) {
    this.virtualList.writeUpdate(true);
    callBack();
    this.virtualList.renderVirtual(true);
    this.virtualList.readUpdate(true);
    this.virtualList.resize();
  }

  openItem(itemSlide: ItemSliding, item: Item) {
    itemSlide.setElementClass("active-sliding", true);
    itemSlide.setElementClass("active-slide", true);
    itemSlide.setElementClass("active-options-right", true);
    item.setElementStyle("transform", "translate3d(-80px, 0px, 0px)");
    setTimeout(() => {
      itemSlide.close();
    }, 1000);
  }

  sortList(sorter) {
    switch (sorter) {
      case 'popular':
        this.list.sort(Utils.compareOrder);
        break;
      case 'price':
        this.list.sort(Utils.comparePrices);
        break;
      case 'marketcap':
        this.list.sort(Utils.compareMarketCap);
        break;
      default:
        this.list.sort(Utils.compareOrder);
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
    this.storage.set('favorites', this.favorites);
    this.list = [];
    this.updateVirtualList(() => {
      this.list = this.coins = this.coins.filter(item => item.name !== coin.name);
    });
    item.close();
    this.searchTerm = '';
  }

  removeFromFavorites(item, coin) {
    const index = this.favorites.indexOf(coin);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
    this.storage.set('favorites', this.favorites);
    this.coins.push(coin);
    item.close();
  }
}
