import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Coin} from "../../classes/coin";
import {single, multi} from "../../classes/data";
import {ApiService} from "../../services/api.service";

@IonicPage()
@Component({
  selector: 'page-coin-details',
  templateUrl: 'coin-details.html',
})
export class CoinDetailsPage {
  coin?: Coin;


  single: any[];
  multi: any[];

  view: any[] = [];

  // options
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

  // line, area
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
    return this.apiService.coinHistoryPriceList;
  }

  ionViewDidLoad() {
    setTimeout(() => this.apiService.getPriceHistoryMinute(this.coin), 2000);
  }

  detectChange(priceChange): boolean {
    return priceChange < 0;
  }


//   public lineChartData: Array<any> = [
//     {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
//     {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
//     {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
//   ];
//   public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
//   public lineChartOptions: any = {
//     responsive: true
//   };
//   public lineChartColors: Array<any> = [
//     { // grey
//       backgroundColor: 'rgba(148,159,177,0.2)',
//       borderColor: 'rgba(148,159,177,1)',
//       pointBackgroundColor: 'rgba(148,159,177,1)',
//       pointBorderColor: '#fff',
//       pointHoverBackgroundColor: '#fff',
//       pointHoverBorderColor: 'rgba(148,159,177,0.8)'
//     },
//     { // dark grey
//       backgroundColor: 'rgba(77,83,96,0.2)',
//       borderColor: 'rgba(77,83,96,1)',
//       pointBackgroundColor: 'rgba(77,83,96,1)',
//       pointBorderColor: '#fff',
//       pointHoverBackgroundColor: '#fff',
//       pointHoverBorderColor: 'rgba(77,83,96,1)'
//     },
//     { // grey
//       backgroundColor: 'rgba(148,159,177,0.2)',
//       borderColor: 'rgba(148,159,177,1)',
//       pointBackgroundColor: 'rgba(148,159,177,1)',
//       pointBorderColor: '#fff',
//       pointHoverBackgroundColor: '#fff',
//       pointHoverBorderColor: 'rgba(148,159,177,0.8)'
//     }
//   ];
//   public lineChartLegend: boolean = true;
//   public lineChartType: string = 'line';
//
//   public randomize(): void {
//     let _lineChartData: Array<any> = new Array(this.lineChartData.length);
//     for (let i = 0; i < this.lineChartData.length; i++) {
//       _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
//       for (let j = 0; j < this.lineChartData[i].data.length; j++) {
//         _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
//       }
//     }
//     this.lineChartData = _lineChartData;
//   }
//
// // events
//   public chartClicked(e: any): void {
//     console.log(e);
//   }
//
//   public chartHovered(e: any): void {
//     console.log(e);
//   }


  onSelect(event) {
    console.log(event);
  }
}
