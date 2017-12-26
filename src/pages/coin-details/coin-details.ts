import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Coin} from "../../classes/coin";
import {ApiService} from "../../services/api.service";

@IonicPage()
@Component({
  selector: 'page-coin-details',
  templateUrl: 'coin-details.html',
})
export class CoinDetailsPage {
  coin?: Coin;
  view: any[] = null;
  showXAxis = false;
  showYAxis = false;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Country';
  showYAxisLabel = false;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  autoScale = true;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiService) {
    // this.coin = navParams.data;
    this.coin = {
      name: 'Bitcoin',
      code: 'BTC',
      imageUrl: 'https://www.cryptocompare.com/media/19633/btc.png',
      currencies: {
        btc: {price: 1, change: -1.189234009752647, marketcap: 16758550},
        usd: {price: 14809.61, change: 23.051644830863925, marketcap: 248187589665.5},
        eur: {price: 12965.69, change: 27.148140048699126, marketcap: 217286164149.5}
      }
    };
  }

  get priceHistoryList() {
    // console.log(this.apiService.coinHistoryPriceList);
    return this.apiService.coinHistoryPriceList;
  }

  ionViewDidLoad() {
    this.apiService.getPriceHistoryMinute(this.coin);
  }

  detectChange(priceChange): boolean {
    return priceChange < 0;
  }

  onSelect(event, serie) {
    console.log(serie);
  }
}
