import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ApiService} from "../../services/api.service";
import {Currency} from "../../classes/currency";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  currentCurrency: any = 'EUR';
  currencies: Array<Currency>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiService,
              private storage: Storage) {
    this.apiService.storedCurrency.subscribe((data: Currency) => {
      if (data) {
        this.currentCurrency = data.code;
      }
    })
  }

  ionViewDidLoad() {
    //TODO Get a nice list of currencies
    this.currencies = [
      {
        name: 'Euro',
        code: 'eur',
        symbol: '€'
      },
      {
        name: 'US Dollar',
        code: 'usd',
        symbol: '$'
      },
      {
        name: 'Bitcoin',
        code: 'btc',
        symbol: 'B'
      },
    ];
  }

  currencyChanged(event) {
    const currency = this.currencies.find(item => {
      return item.code === event;
    });

    this.apiService.saveCurrency(currency);
  }

  clearStorage() {
    this.storage.clear();
  }
}
