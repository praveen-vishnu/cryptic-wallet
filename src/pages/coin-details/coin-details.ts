import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Coin} from "../../classes/coin";
import {ApiService} from "../../services/api.service";
import {Chart} from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-coin-details',
  templateUrl: 'coin-details.html',
})
export class CoinDetailsPage {
  coin?: Coin;
  chart = [];

  // single: any[];
  // multi: any[];
  //
  // view: any[] = [];
  //
  // // options
  // showXAxis = false;
  // showYAxis = false;
  // gradient = false;
  // showLegend = false;
  // showXAxisLabel = false;
  // xAxisLabel = 'Country';
  // showYAxisLabel = false;
  // yAxisLabel = 'Population';
  //
  // colorScheme = {
  //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  // };
  //
  // // line, area
  // autoScale = true;


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

  // get priceHistoryList() {
  //
  // }

  ionViewDidLoad() {
    this.apiService.getPriceHistoryMinute(this.coin);

    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: [1514049120,1514049300,1514049480,1514049660,1514049840,1514050020,1514050200,1514050380,1514050560,1514050740,1514050920,1514051100,1514051280,1514051460,1514051640,1514051820,1514052000,1514052180,1514052360,1514052540,1514052720,1514052900,1514053080,1514053260,1514053440,1514053620,1514053800,1514053980,1514054160,1514054340,1514054520,1514054700,1514054880,1514055060,1514055240,1514055420,1514055600,1514055780,1514055960,1514056140,1514056320,1514056500,1514056680,1514056860,1514057040,1514057220,1514057400,1514057580,1514057760,1514057940,1514058120,1514058300,1514058480,1514058660,1514058840,1514059020,1514059200,1514059380,1514059560,1514059740,1514059920],
        datasets: [{
          // label: '# of Votes',
          data: [13052.68,13130.56,13129.9,13106.39,13002.39,12968.38,12962.06,13000.55,12993.99,12951.29,12918.69,12850.43,12843.52,12921.77,12916.87,12950.5,13020.37,13031.12,13050.66,13083.98,13026.53,13020.36,13035.27,13002.84,13035.79,12999.74,13038.04,12999.22,12966.21,12966.22,12954.22,12956.09,12950.71,12927.4,12853.28,12878.82,12862.94,12885.82,12900.56,12900.59,12907.34,12906.55,12907.99,12897.88,12896.83,12916,12891.11,12847.29,12827.31,12833.67,12779.62,12764.07,12791.34,12869.78,12849.36,12820.64,12822.68,12802.16,12795.37,12804.2,12793.77],
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
          borderWidth: 2,
          lineTension: 0
        }]
      },
      options: {
        responsive: true,
        title: false,
        legend: false,
        axes: false,
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
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
          }]
        },
        elements: {
          point: {
            radius: 0
          }
        }
      }
    });
  }

  addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
    chart.update();
  }


  detectChange(priceChange): boolean {
    return priceChange < 0;
  }

//
//
//   public lineChartData: Array<any> = [
//     {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
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
//   public lineChartLegend: boolean = false;
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


  // onSelect(event, serie) {
  //   console.log(serie);
  // }
}
