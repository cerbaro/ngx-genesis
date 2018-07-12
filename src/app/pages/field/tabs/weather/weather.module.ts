import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherComponent } from './weather/weather.component';
import { WeatherRoutingModule } from './weather-routing.module';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';

import { ChartModule } from '@kiwigrid/ngx-highcharts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
    imports: [
        CommonModule,
        WeatherRoutingModule,
        LayoutComponentsModule,

        ChartModule,
        LeafletModule
    ],
    declarations: [
        WeatherComponent
    ]
})
export class WeatherModule { }
