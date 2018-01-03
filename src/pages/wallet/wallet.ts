import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Slides, ToastController} from 'ionic-angular';
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
  currentWallet: Wallet;
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private storage: Storage) {
  }

  ionViewDidLoad() {
    this.getStoredWallets();
  }

  ionViewWillEnter() {
    this.getStoredWallets();
  }

  trackByCoin(index, item): number {
    return index; // or item.id
  }

  detectChange(priceChange): boolean {
    return priceChange < 0;
  }

  private getStoredWallets() {
    this.storage.get('wallets').then(data => {
      if (!!data) {
        this.wallets = data;
        const currentIndex = this.slides.getActiveIndex();
        this.currentWallet = this.wallets[currentIndex];
      }
    });
  }

  slideChanged(event) {
    this.currentWallet = this.wallets[event.realIndex];
  }

  goToEditWallets() {
    this.navCtrl.push(WalletEditPage);
  }

  goToCoinList() {
    const index = this.slides.getActiveIndex();
    this.navCtrl.push(CoinListWalletPage, {'walletIndex': index});
  }

  getTotalPrice() {
    if (this.currentWallet) {
      let total: number = 0;
      this.currentWallet.coins.forEach(coin => {
        total += coin.wallet.total;
      });
      return total;
    }
    return 0;
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

  delete(index) {
    this.wallets[this.slides.getActiveIndex()].coins.splice(index, 1);
    this.storage.set('wallets', this.wallets);
  }
}
