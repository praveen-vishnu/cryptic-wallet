import {Component} from '@angular/core';
import {CoinListPage} from "./coin-list";
import {NavController, NavParams} from "ionic-angular";
import {ApiService} from "../../services/api.service";
import {Storage} from '@ionic/storage';
import {Wallet} from "../../classes/wallet";

@Component({
  selector: 'page-coin-list-wallet',
  templateUrl: 'coin-list.html',
})
export class CoinListWalletPage extends CoinListPage {
  wallets: Array<Wallet> = [];
  search: boolean = true;
  coinsSearchList: any;
  currentWalletIndex: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public apiService: ApiService,
              private storage: Storage) {
    super(navCtrl, navParams, apiService);
    this.currentWalletIndex = navParams.data.walletIndex;
    this.apiService.coinList.subscribe((coinList: Array<any>) => {
      const filteredList = coinList.filter(coin => {
        return !this.wallets[this.currentWalletIndex].coins.some(item => item.name === coin.name);
      });
      return this.coinsSearchList = this.coins = filteredList;
    });
  }

  ionViewDidLoad() {
    this.apiService.getCoinList();
    this.storage.get('wallets').then(data => {
      if (!!data) {
        this.wallets = data;
      }
    });
  }

  selectedCoin(coin) {
    console.log(this.storage.driver);
    this.wallets[this.currentWalletIndex].coins.push(coin);
    this.storage.set('wallets', this.wallets).then(() => this.navCtrl.pop());
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
