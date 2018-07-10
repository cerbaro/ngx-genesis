import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherComponent } from './weather/weather.component';
import { WeatherRoutingModule } from './weather-routing.module';

@NgModule({
    imports: [
        CommonModule,
        WeatherRoutingModule
    ],
    declarations: [
        WeatherComponent
    ]
})
export class WeatherModule { }
