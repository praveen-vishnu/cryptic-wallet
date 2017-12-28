import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Coin} from '../../classes/coin';
import {ApiService} from '../../services/api.service';
import {curveNatural} from 'd3-shape';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-coin-details',
  templateUrl: 'coin-details.html',
})
export class CoinDetailsPage {
  coin?: Coin;
  view: any[] = undefined;
  showXAxis = false;
  showYAxis = false;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  showYAxisLabel = false;
  curve = curveNatural;
  price: number;
  timestamp: string;
  chartMode: any;

  colorScheme = {
    domain: ['#2a95da']
  };
  autoScale = true;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiService,
              private cdRef: ChangeDetectorRef) {
    this.coin = navParams.data;
    //
    // this.coin = {
    //   name: 'Bitcoin',
    //   code: 'BTC',
    //   imageUrl: 'https://www.cryptocompare.com/media/19633/btc.png',
    //   currencies: {
    //     btc: {price: 1, change: -1.189234009752647, marketcap: 16758550},
    //     usd: {price: 14809.61, change: 23.051644830863925, marketcap: 248187589665.5},
    //     eur: {price: 12965.69, change: 27.148140048699126, marketcap: 217286164149.5}
    //   }
    // };

    this.price = this.coin.currencies.eur.price;
  }

  get priceHistoryList() {
    return this.apiService.coinHistoryPriceList;
  }

  ionViewDidLoad() {
    this.chartMode = 'hour';
    this.apiService.getPriceHistoryHour(this.coin);
  }

  ionViewDidLeave() {
    this.coin = null;
    this.apiService.coinHistoryPriceList = null;
  }

  detectChange(priceChange): boolean {
    return priceChange < 0;
  }

  onScrub(event, serie) {
    this.timestamp = moment.unix(event.name).format("DD-MM-YYYY HH:mm");
    this.coin.currencies.eur.price = event.value;
    this.cdRef.detectChanges();
  }

  onScrubEnd() {
    this.coin.currencies.eur.price = this.price;
    this.timestamp = null;
  }

  chartModeChanged(event) {
    switch (this.chartMode) {
      case 'hour':
        this.apiService.coinHistoryPriceList = null;
        this.apiService.getPriceHistoryHour(this.coin);
        break;
      case 'day':
        this.apiService.coinHistoryPriceList = null;
        this.apiService.getPriceHistoryDay(this.coin);
        break;
      case 'month':
        this.apiService.coinHistoryPriceList = null;
        this.apiService.getPriceHistoryMonth(this.coin);
        break;
      case 'year':
        this.apiService.coinHistoryPriceList = null;
        this.apiService.getPriceHistoryYear(this.coin);
        break;
      case 'all':
        this.apiService.coinHistoryPriceList = null;
        this.apiService.getPriceHistoryAll(this.coin);
        break;
      default:
        this.apiService.coinHistoryPriceList = null;
        this.apiService.getPriceHistoryHour(this.coin);
    }
  }
}
