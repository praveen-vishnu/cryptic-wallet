import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Coin} from '../../classes/coin';
import {ApiService} from '../../services/api.service';
import {curveNatural} from 'd3-shape';
import * as moment from 'moment';
import Chart from 'chart.js';

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

  chartjs: any;
  @ViewChild('canvas') canvas: ElementRef;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiService,
              private cdRef: ChangeDetectorRef) {
    this.coin = navParams.data;
    this.overrideCoin();

    this.price = this.coin.currencies.eur.price;
  }

  get priceHistoryList() {
    return this.apiService.coinHistoryPriceList;
  }

  getChartData() {
    this.apiService.coinHistoryPriceListJS.subscribe(value => {
      if (!!value) {
        this.chartJS(value['labels'], value['data']);
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
        btc: {price: 1, change: -1.189234009752647, marketcap: 16758550},
        usd: {price: 14809.61, change: 23.051644830863925, marketcap: 248187589665.5},
        eur: {price: 12965.69, change: 27.148140048699126, marketcap: 217286164149.5}
      }
    };
  }

  ionViewDidLoad() {
    this.chartMode = 'hour';
    this.apiService.getPriceHistoryHour(this.coin);
    this.getChartData();
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
    this.chartjs.destroy();
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

  chartJS(labels, data) {
    this.chartjs = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          pointRadius: 0,
        }]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          yAxes: [{
            display: false,
            ticks: {
              beginAtZero: false
            }
          }],
          xAxes: [{
            display: false,
            ticks: {
              beginAtZero: false
            }
          }]
        }
      }
    });
  }
}
