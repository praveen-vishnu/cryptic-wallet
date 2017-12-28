import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {area, line} from 'd3-shape';
import {id, sortByDomain, sortByTime, sortLinear} from "@swimlane/ngx-charts/release/utils";


@Component({
  selector: 'g[custom-chart-line-series]',
  templateUrl: 'custom-chart-line-series.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomChartLineSeriesComponent implements OnChanges {
  @Input() data;
  @Input() xScale;
  @Input() yScale;
  @Input() colors;
  @Input() scaleType;
  @Input() curve: any;
  @Input() activeEntries: any[];
  @Input() rangeFillOpacity: number;
  @Input() hasRange: boolean;
  @Input() animations: boolean = true;

  path: string;
  outerPath: string;
  areaPath: string;
  gradientId: string;
  gradientUrl: string;
  hasGradient: boolean;
  gradientStops: any[];
  areaGradientStops: any[];
  stroke: any;

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  update(): void {
    this.updateGradients();

    const data = this.sortData(this.data.series);

    const lineGen = this.getLineGenerator();
    this.path = lineGen(data) || '';

    const areaGen = this.getAreaGenerator();
    this.areaPath = areaGen(data) || '';

    if (this.hasRange) {
      const range = this.getRangeGenerator();
      this.outerPath = range(data) || '';
    }

    if (this.hasGradient) {
      this.stroke = this.gradientUrl;
      const values = this.data.series.map(d => d.value);
      const max = Math.max(...values);
      const min = Math.min(...values);
      if (max === min) {
        this.stroke = this.colors.getColor(max);
      }
    } else {
      this.stroke = this.colors.getColor(this.data.name);
    }
  }

  getLineGenerator(): any {
    return line<any>()
      .x(d => {
        const label = d.name;
        let value;
        if (this.scaleType === 'time') {
          value = this.xScale(label);
        } else if (this.scaleType === 'linear') {
          value = this.xScale(Number(label));
        } else {
          value = this.xScale(label);
        }
        return value;
      })
      .y(d => this.yScale(d.value))
      .curve(this.curve);
  }

  getRangeGenerator(): any {
    return area<any>()
      .x(d => {
        const label = d.name;
        let value;
        if (this.scaleType === 'time') {
          value = this.xScale(label);
        } else if (this.scaleType === 'linear') {
          value = this.xScale(Number(label));
        } else {
          value = this.xScale(label);
        }
        return value;
      })
      .y0(d => this.yScale(d.min ? d.min : d.value))
      .y1(d => this.yScale(d.max ? d.max : d.value))
      .curve(this.curve);
  }

  getAreaGenerator(): any {
    const xProperty = (d) => {
      const label = d.name;
      return this.xScale(label);
    };

    return area<any>()
      .x(xProperty)
      .y0(() => this.yScale.range()[0])
      .y1(d => this.yScale(d.value))
      .curve(this.curve);
  }

  sortData(data) {
    if (this.scaleType === 'linear') {
      data = sortLinear(data, 'name');
    } else if (this.scaleType === 'time') {
      data = sortByTime(data, 'name');
    } else {
      data = sortByDomain(data, 'name', 'asc', this.xScale.domain());
    }

    return data;
  }

  updateGradients() {
    if (this.colors.scaleType === 'linear') {
      this.hasGradient = true;
      this.gradientId = 'grad' + id().toString();
      this.gradientUrl = `url(#${this.gradientId})`;
      const values = this.data.series.map(d => d.value);
      const max = Math.max(...values);
      const min = Math.min(...values);
      this.gradientStops = this.colors.getLinearGradientStops(max, min);
      this.areaGradientStops = this.colors.getLinearGradientStops(max);
    } else {
      this.hasGradient = false;
      this.gradientStops = undefined;
      this.areaGradientStops = undefined;
    }
  }

  isActive(entry): boolean {
    if (!this.activeEntries) return false;
    const item = this.activeEntries.find(d => {
      return entry.name === d.name;
    });
    return item !== undefined;
  }

  isInactive(entry): boolean {
    if (!this.activeEntries || this.activeEntries.length === 0) return false;
    const item = this.activeEntries.find(d => {
      return entry.name === d.name;
    });
    return item === undefined;
  }
}
