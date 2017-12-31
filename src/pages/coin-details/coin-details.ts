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
  scrubberX: number;
  scrubberIsActive: boolean = false;

  colorScheme = {
    domain: ['#2a95da']
  };
  autoScale = true;

  chartjs: Chart;

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
    this.chartMode = 'day';
    this.getChartData();
    this.apiService.getPriceHistoryDay(this.coin);
  }

  ionViewDidLeave() {
    this.coin = null;
    this.apiService.coinHistoryPriceList = null;
    // this.apiService.coinHistoryPriceListJS.unsubscribe();
    this.chartjs.destroy();
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
        this.apiService.getPriceHistoryHour(this.coin);
    }
  }

  chartJS(labels, data) {
    if (!!this.chartjs) {
      this.chartjs.destroy();
    }
    this.chartjs = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          // backgroundColor: [
          //   'rgba(35, 87, 105, 0.2)',
          // ],
          borderColor: [
            'rgba(35, 87, 105, 1)',
          ],
          borderWidth: 3,
          pointRadius: 0,
        }]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
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

  onScrubChartJs(evt) {
    const index = this.getIndexForTouchEvent(evt);
    this.updatePriceAndDate(index);
  }

  onScrubStartChartJs(evt) {
    const index = this.getIndexForTouchEvent(evt);
    this.updatePriceAndDate(index);
    this.scrubberIsActive = true;
  }

  onScrubEndChartJs(evt) {
    this.coin.currencies.eur.price = this.price;
    this.scrubberX = 0;
    this.scrubberIsActive = false;
  }

  private getIndexForTouchEvent(evt) {
    const targetTouch = evt.targetTouches[0];
    const xPos = targetTouch.pageX;
    const canvasWidth = targetTouch.target.clientWidth;
    this.scrubberX = canvasWidth - xPos;
    return this.chartjs.scales['x-axis-0'].getValueForPixel(xPos);
  }

  private updatePriceAndDate(index: any) {
    if (!!index) {
      const label = this.chartjs.data.labels[index];
      const value = this.chartjs.data.datasets[0].data[index];

      if (!!value && !!label) {
        this.timestamp = moment.unix(label).format("DD-MM-YYYY HH:mm");
        this.coin.currencies.eur.price = value;
      }
    }
  }
}
