import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldRoutingModule } from './field-routing.module';
import { FieldComponent } from './field/field.component';
import { WeatherComponent } from './tabs/weather/weather.component';
import { ClimateComponent } from './tabs/climate/climate.component';
import { PhenologyComponent } from './tabs/phenology/phenology.component';
import { SatelliteComponent } from './tabs/satellite/satellite.component';

@NgModule({
    imports: [
        CommonModule,
        FieldRoutingModule
    ],
    declarations: [
        FieldComponent,
        WeatherComponent,
        ClimateComponent,
        PhenologyComponent,
        SatelliteComponent
    ]
})
export class FieldModule { }
