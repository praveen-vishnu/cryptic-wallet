import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ApiService} from "../../services/api.service";
import {Currency} from "../../interfaces/currency";
import {currencies} from "../../classes/currencies";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  currentCurrency: any;
  currencies: Array<Currency> = currencies;
  f

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
