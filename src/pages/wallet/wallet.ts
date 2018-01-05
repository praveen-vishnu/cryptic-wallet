import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Slides, ToastController} from 'ionic-angular';
import {CoinListWalletPage} from "../coin-list/coin-list-wallet";
import {Storage} from '@ionic/storage';
import {Wallet, WalletItem} from "../../classes/wallet";
import {WalletEditPage} from "../wallet-edit/wallet-edit";

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  wallets: Array<Wallet> = [];
  currentWallet?: Wallet;
  walletButtonEnabled: boolean = false;
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private storage: Storage) {
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
      if (data && data.length > 0) {
        this.wallets = data;
        this.currentWallet = this.wallets[this.slides.getActiveIndex()];
      } else {
        this.walletButtonEnabled = true;
      }
    });
  }

  slideChanged(event) {
    if (event.realIndex || event.realIndex === 0) {
      this.currentWallet = this.wallets[event.realIndex];
    }
  }

  goToEditWallets() {
    this.navCtrl.push(WalletEditPage);
  }

  goToCoinList() {
    this.navCtrl.push(CoinListWalletPage, {'walletIndex': this.slides.getActiveIndex()});
  }

  getCoinPrice(wallet): number {
    return parseFloat(wallet.amount) * wallet.coin.currencies.eur.price;
  }

  getTotalPrice() {
    if (this.currentWallet) {
      let total: number = 0;
      this.currentWallet.wallet.forEach(wallet => {
        total += this.getCoinPrice(wallet);
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

  changeCoin(slider, index) {
    let alert = this.alertCtrl.create({
      title: 'New coin amount',
      inputs: [
        {
          name: 'amount',
          placeholder: 'amount',
          type: 'number',
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
            const value = data.amount.trim().replace(',', '.');
            if (value) {
              const currentCoin: WalletItem = this.currentWallet.wallet[index];
              currentCoin.amount = parseFloat(value);
              slider.close();
            } else {
              this.openToast('Name cannot be empty');
            }
          }
        }
      ]
    });

    alert.present();
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
                  wallet: []
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
    this.wallets[this.slides.getActiveIndex()].wallet.splice(index, 1);
    this.storage.set('wallets', this.wallets);
  }

  checkWallet() {
    return this.walletButtonEnabled && this.wallets.length === 0;
  }
}
