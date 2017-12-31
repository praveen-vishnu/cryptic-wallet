import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import * as moment from 'moment';
import Chart from 'chart.js';

@Component({
  selector: 'chartjs',
  templateUrl: 'chartjs.html'
})
export class ChartjsComponent implements OnInit, OnChanges {
  @Input() data: Object;
  @ViewChild('canvas') canvas: ElementRef;
  chartjs: Chart;
  scrubberX: number;
  scrubberIsActive: boolean = false;

  @Output() price = new EventEmitter();
  @Output() date = new EventEmitter();

  constructor() {

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes');
    if (!!changes.data.currentValue) {
      if (!!this.chartjs) {
        this.chartjs.destroy();
      }
      this.chartJS(changes.data.currentValue.labels, changes.data.currentValue.data);
    }
  }

  chartJS(labels, data) {
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
      options: ChartjsComponent.chartJsOptions()
    });
  }

  private static chartJsOptions() {
    return {
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
    };
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
    this.price.emit(null);
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
        const timestamp = moment.unix(label).format("DD-MM-YYYY HH:mm");

        this.price.emit(value);
        this.date.emit(timestamp);
      }
    }
  }
}
