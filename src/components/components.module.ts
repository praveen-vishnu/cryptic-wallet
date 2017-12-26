import {NgModule} from '@angular/core';
import {CustomChartComponent} from './custom-chart/custom-chart';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {CustomChartTooltipAreaComponent} from "./custom-chart-tooltip-area/custom-chart-tooltip-area";

@NgModule({
  declarations: [
    CustomChartComponent,
    CustomChartTooltipAreaComponent,
  ],
  imports: [
    NgxChartsModule
  ],
  exports: [
    CustomChartComponent,
    CustomChartTooltipAreaComponent
  ]
})
export class ComponentsModule {
}
