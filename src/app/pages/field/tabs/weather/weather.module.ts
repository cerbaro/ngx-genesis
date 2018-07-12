import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WeatherComponent } from './weather/weather.component';
import { WeatherRoutingModule } from './weather-routing.module';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';

@NgModule({
    imports: [
        CommonModule,
        WeatherRoutingModule,

        LayoutComponentsModule
    ],
    declarations: [
        WeatherComponent
    ]
})
export class WeatherModule { }
