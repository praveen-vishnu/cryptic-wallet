import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiService} from "../../services/api.service";
import {CoinDetailsPage} from "../coin-details/coin-details";
import {Storage} from "@ionic/storage";
import {NativePageTransitions, NativeTransitionOptions} from "@ionic-native/native-page-transitions";

@IonicPage()
@Component({
  selector: 'page-coin-list',
  templateUrl: 'coin-list.html',
})
export class CoinListPage {
  search: boolean = false;
  coins: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              private nativePageTransitions: NativePageTransitions,
              public apiService: ApiService) {
    this.apiService.coinList.subscribe(coinList => {
      this.storage.set('coin-list', coinList);
      return this.coins = coinList;
    });
  }

  ionViewDidEnter() {
    this.storage.get('coin-list').then(list => {
      !list ? this.apiService.getCoinList() : this.coins = list;
    });
  }

  ionViewWillLeave() {

    let options: NativeTransitionOptions = {
      direction: 'down',
      duration: 500,
      slowdownfactor: 3,
      slidePixels: 20,
      iosdelay: 100,
      androiddelay: 150,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 60
    };

    this.nativePageTransitions.slide(options)
      .then(() => console.log('transition done'))
      .catch();

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
