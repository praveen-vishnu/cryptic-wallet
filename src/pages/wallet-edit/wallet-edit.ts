import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, reorderArray, ToastController} from 'ionic-angular';
import {Wallet} from "../../interfaces/wallet";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-wallet-edit',
  templateUrl: 'wallet-edit.html',
})
export class WalletEditPage {
  wallets: Array<Wallet> = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private storage: Storage) {
  }

  ionViewDidLoad() {
    this.storage.get('wallets').then(data => {
      if (!!data) {
        this.wallets = data;
      }
    });
  }

  reorder(event) {
    this.wallets = reorderArray(this.wallets, event);
    this.storage.set('wallets', this.wallets);
  }

  delete(index) {
    this.wallets.splice(index, 1);
    this.storage.set('wallets', this.wallets);

    const walletPage = this.navCtrl.first().instance;
    walletPage.slides.slideTo(0);

    if (this.wallets.length === 0) {
      walletPage.wallets = [];
      walletPage.currentWallet = null;
    }
  }

  openToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  changeWallet(slider, index) {
    let alert = this.alertCtrl.create({
      title: 'New wallet name',
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
            this.checkConstraints((value) => {
              this.wallets[index].name = value;
              this.storage.set('wallets', this.wallets);
            }, data, slider);
          }
        }
      ]
    });

    alert.present();
  }

  addNewWallet() {
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
            this.checkConstraints((value) => {
              const wallet: Wallet = {
                name: value,
                coins: []
              };
              this.wallets.push(wallet);
              this.storage.set('wallets', this.wallets);
            }, data);
          }
        }
      ]
    });

    alert.present();
  }

  private checkConstraints(storeValue, data?, slider?) {
    const value = data.name.trim();
    if (value) {
      if (value.length <= 32) {
        if (!this.checkIfExists(value)) {
          storeValue(value);
        } else {
          this.openToast('Name is already used');
        }
        if (!!slider) {
          slider.close();
        }
      } else {
        this.openToast('Name cannot be more then 32 characters');
      }
    } else {
      this.openToast('Name cannot be empty');
    }
  }

  checkIfExists(value): boolean {
    return !!this.wallets ? this.wallets.some(item => value.toLowerCase() === item.name.toLowerCase()) : false;
  }
}
