import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import * as moment from 'moment';
import Chart from 'chart.js';

@Component({
  selector: 'chartjs',
  templateUrl: 'chartjs.html'
})
export class ChartjsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: Object;
  @ViewChild('canvas') canvas: ElementRef;
  chartjs: Chart;
  scrubberX: number;
  scrubberIsActive: boolean = false;
  isLoading: boolean = false;
  storedChartIndex: number;

  @Output() price = new EventEmitter();
  @Output() date = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.isLoading = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.destroyChart();
    if (!!changes.data.currentValue) {
      this.chartJS(changes.data.currentValue.labels, changes.data.currentValue.data);
    } else {
      this.isLoading = true;
    }
  }

  ngOnDestroy() {
    this.destroyChart();
  }

  chartJS(labels, data) {
    this.isLoading = false;
    this.destroyChart();
    this.chartjs = new Chart(this.canvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(15, 28, 40, 1)',
          ],
          borderColor: [
            // TODO Different theme colors
            'rgba(228, 107, 32, 1)',
            'rgba(159, 228, 32, 1)',
            'rgba(32, 162, 228, 1)',
            'rgba(228, 32, 110, 1)',
          ],
          borderWidth: 2,
          pointRadius: 0,
        }]
      },
      options: ChartjsComponent.chartJsOptions()
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
    this.price.emit(null);
    this.date.emit(null);
    this.scrubberX = 0;
    this.scrubberIsActive = false;
  }

  private destroyChart() {
    if (!!this.chartjs) {
      this.chartjs.destroy();
    }
  }

  private getIndexForTouchEvent(evt) {
    const targetTouch = evt.targetTouches[0];
    const xPos = targetTouch.pageX;
    const canvasWidth = targetTouch.target.clientWidth;
    const currentIndex = this.chartjs.scales['x-axis-0'].getValueForPixel(xPos);
    if (currentIndex !== this.storedChartIndex) {
      this.scrubberX = canvasWidth - xPos;
    }
    this.storedChartIndex = currentIndex;
    return currentIndex;
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

  private static chartJsOptions() {
    return {
      responsive: true,
      legend: {
        display: false
      },
      elements: {
        line: {
          tension: 0
        },
        point: {
          radius: 0,
          hitRadius: 0,
          hoverRadius: 0
        }
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
}
