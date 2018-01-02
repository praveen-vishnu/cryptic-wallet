import {Component} from '@angular/core';
import {CoinListPage} from "./coin-list";
import {AlertController, NavController, NavParams, ToastController} from "ionic-angular";
import {ApiService} from "../../services/api.service";
import {Storage} from '@ionic/storage';
import {Wallet} from "../../classes/wallet";
import {Coin} from "../../classes/coin";

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
              public toastCtrl: ToastController,
              private alertCtrl: AlertController,
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
    this.addNewCoinAmount(coin);
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

  addNewCoinAmount(coin: Coin) {
    let alert = this.alertCtrl.create({
      title: 'How much coins did you buy?',
      inputs: [
        {
          name: 'amount',
          placeholder: 'amount',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            const value = data.amount.trim();
            if (value) {
              coin.wallet = {
                amount: parseFloat(value),
                total: parseFloat(value) * coin.currencies.eur.price
              };
              this.wallets[this.currentWalletIndex].coins.push(coin);
              this.storage.set('wallets', this.wallets).then(() => this.navCtrl.pop());
            } else {
              this.openToast('Name cannot be empty');
            }
          }
        }
      ]
    });

    alert.present();
  }

  openToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

}
