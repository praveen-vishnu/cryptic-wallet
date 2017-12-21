import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Coin} from "../../classes/coin";

@IonicPage()
@Component({
  selector: 'page-coin-details',
  templateUrl: 'coin-details.html',
})
export class CoinDetailsPage {
  coin?: Coin;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.coin = navParams.data;
  }

  ionViewDidLoad() {
  }

}
