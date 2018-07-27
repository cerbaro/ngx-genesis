import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { WeatherComponent } from './weather/weather.component';
import { WeatherRoutingModule } from './weather-routing.module';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';

import { ChartModule } from '@kiwigrid/ngx-highcharts';
import { MapModule } from 'src/app/shared/modules/map/map.module';
import { AgroGISService } from 'src/app/shared/services/agrogis/agrogis.service';
import { DarkskyService } from 'src/app/shared/services/cds/darksky.service';

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
    ],
    providers: [
        AgroGISService,
        DarkskyService,
        DatePipe
    ]
})
export class WeatherModule { }
