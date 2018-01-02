import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {CoinListWalletPage} from "../coin-list/coin-list-wallet";
import {Storage} from '@ionic/storage';
import {Wallet} from "../../classes/wallet";
import {WalletEditPage} from "../wallet-edit/wallet-edit";

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  wallets: Array<Wallet> = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private storage: Storage) {
  }

  ionViewDidLoad() {
    this.storage.get('wallets').then(data => {
      if (!!data) {
        this.wallets = data;
      }
    });
  }

  ionViewWillEnter() {
    this.storage.get('wallets').then(data => {
      if (!!data) {
        this.wallets = data;
      }
    });
    // const wallet: Wallet = {
    //   id: 0,
    //   name: 'Doris',
    //   coins: []
    // };
    //
    // this.storage.set('wallets:' + wallet.id, wallet);
    //
    // this.storage.get('wallets').then(value => {
    //   console.log(value);
    // });
  }

  goToEditWallets() {
    this.navCtrl.push(WalletEditPage);
  }

  goToCoinList() {
    this.navCtrl.push(CoinListWalletPage);
  }

  openToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  addNewCoin() {
    let alert = this.alertCtrl.create({
      title: 'Wallet name',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
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
            if (data.name) {
              if (!this.checkIfExists(data)) {
                const wallet: Wallet = {
                  name: data.name,
                  coins: []
                };
                this.wallets.push(wallet);
                this.storage.set('wallets', this.wallets);
              } else {
                this.openToast('Name is already been used');
              }
            } else {
              this.openToast('Name cannot be empty');
            }
          }
        }
      ]
    });

    alert.present();
  }

  checkIfExists(data): boolean {
    return !!this.wallets ? this.wallets.some(item => data.name.toLowerCase() === item.name.toLowerCase()) : false;
  }
}
