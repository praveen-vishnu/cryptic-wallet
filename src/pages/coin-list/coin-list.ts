import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiService} from "../../services/api.service";
import {Coin} from "../../classes/coin";
import {CoinDetailsPage} from "../coin-details/coin-details";

@IonicPage()
@Component({
  selector: 'page-coin-list',
  templateUrl: 'coin-list.html',
})
export class CoinListPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiService) {
  }

  ionViewDidLoad() {
    this.apiService.getCoinList();
  }

  get coinListLength(): string {
    return this.apiService.coinList ? this.apiService.coinList.length.toString() : '0';
  }

  get coins(): Array<Coin> {
    return this.apiService.coinList;
  }

  goToDetailPage(coin): void {
    this.navCtrl.push(CoinDetailsPage, coin);
  }

  trackByCoin(index, item) {
    return index; // or item.id
  }

}
