import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Coin} from '../../classes/coin';
import {ApiService} from '../../services/api.service';
import * as moment from "moment";

@IonicPage()
@Component({
  selector: 'page-coin-details',
  templateUrl: 'coin-details.html',
})
export class CoinDetailsPage {
  coin?: Coin;
  price: number;
  currentDate: string;
  priceDate: string;
  chartMode: any;
  data: any;
  @ViewChild('segment') segment: ElementRef;
  @ViewChild('timestamp') timestamp: ElementRef;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiService) {
    this.coin = navParams.data;
    // this.overrideCoin();
    if (this.coin) {
      this.price = this.coin.currencies.eur.price;
      //TODO the current date probably doesn't correspond with the last retrieved price date
      this.priceDate = this.currentDate = moment.unix(this.coin.currencies.eur.priceLastUpdated).format("DD-MM-YYYY HH:mm");
    }
  }

  subscribePriceHistoryDataNGX() {
    this.apiService.coinHistoryPriceListJS.subscribe(value => {
      if (!!value) {
        this.data = value;
      }
    });
  }

  subscribePriceHistoryData() {
    this.apiService.coinHistoryPriceListJS.subscribe(value => {
      if (!!value) {
        this.data = value;
      }
    });
  }

  overrideCoin() {
    this.coin = {
      name: 'Bitcoin',
      code: 'BTC',
      imageUrl: 'https://www.cryptocompare.com/media/19633/btc.png',
      order: '1',
      currencies: {
        btc: {price: 1, priceLastUpdated: 1514827291, change: -1.189234009752647, marketcap: 16758550},
        usd: {price: 14809.61, priceLastUpdated: 1514827291, change: 23.051644830863925, marketcap: 248187589665.5},
        eur: {price: 12965.69, priceLastUpdated: 1514827291, change: 27.148140048699126, marketcap: 217286164149.5}
      }
    };
  }

  ionViewDidEnter() {
    this.chartMode = 'day';
    this.subscribePriceHistoryData();
    this.apiService.getPriceHistoryDay(this.coin);
  }

  ionViewDidLeave() {
    this.apiService.coinHistoryPriceListJS.next(null);
  }

  get calculateChartHeight() {
    const heightNumber = this.segment.nativeElement.clientHeight + this.timestamp.nativeElement.clientHeight;
    return `calc(100% - ${heightNumber}px)`;
  }

  detectChange(priceChange): boolean {
    return priceChange < 0;
  }

  chartModeChanged(event) {
    this.data = null;
    switch (this.chartMode) {
      case 'day':
        this.apiService.coinHistoryPriceList = null;
        this.apiService.getPriceHistoryDay(this.coin);
        break;
      case 'week':
        this.apiService.coinHistoryPriceList = null;
        this.apiService.getPriceHistoryWeek(this.coin);
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
        this.apiService.getPriceHistoryDay(this.coin);
    }
  }

  updatePrice(value) {
    if (!!value) {
      this.coin.currencies.eur.price = value;
    } else {
      this.coin.currencies.eur.price = this.price;
    }
  }

  updateDate(value) {
    if (!!value) {
      this.priceDate = value;
    } else {
      this.priceDate = this.currentDate;
    }
  }
}
