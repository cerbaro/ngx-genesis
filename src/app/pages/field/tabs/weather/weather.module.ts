import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherComponent } from './weather/weather.component';
import { WeatherRoutingModule } from './weather-routing.module';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';

import { ChartModule } from '@kiwigrid/ngx-highcharts';
import { MapModule } from 'src/app/shared/modules/map/map.module';

@NgModule({
    imports: [
        CommonModule,
        WeatherRoutingModule,
        LayoutComponentsModule,

        ChartModule,
        MapModule
    ],
    declarations: [
        WeatherComponent
    ]
})
export class WeatherModule { }
