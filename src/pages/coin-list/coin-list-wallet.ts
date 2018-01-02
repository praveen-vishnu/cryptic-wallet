import {Component} from '@angular/core';
import {CoinListPage} from "./coin-list";
import {NavController, NavParams} from "ionic-angular";
import {ApiService} from "../../services/api.service";
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-coin-list-wallet',
  templateUrl: 'coin-list.html',
})
export class CoinListWalletPage extends CoinListPage {
  search: boolean = true;
  coinsSearchList: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public apiService: ApiService,
              private storage: Storage) {
    super(navCtrl, navParams, apiService);
    this.apiService.coinList.subscribe(coinList => this.coinsSearchList = this.coins = coinList);
  }

  selectedCoin(coin) {
    console.log(this.storage.driver);


    // wallet.coins.push(coin);
    //
    // this.storage.set('wallets', wallet);
    this.navCtrl.pop();
  }

  filterCoins(event) {
    this.coins = this.coinsSearchList;
    let value = event.target.value;

    if (value && value.trim() != '') {
      this.coins = this.coins.filter((item) => {
        return (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
      })
    }
  }
}
