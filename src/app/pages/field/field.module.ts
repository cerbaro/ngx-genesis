import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldRoutingModule } from './field-routing.module';
import { FieldComponent } from './field/field.component';
import { WeatherComponent } from './tabs/weather/weather.component';
import { ClimateComponent } from './tabs/climate/climate.component';
import { PhenologyComponent } from './tabs/phenology/phenology.component';
import { SatelliteComponent } from './tabs/satellite/satellite.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { MapBoxService } from '../../shared/services/map-box.service';

@NgModule({
    imports: [
        CommonModule,
        FieldRoutingModule,

        LayoutComponentsModule,

        LeafletModule
    ],
    declarations: [
        FieldComponent,
        WeatherComponent,
        ClimateComponent,
        PhenologyComponent,
        SatelliteComponent
    ],
    providers: [
        MapBoxService
    ]
})
export class FieldModule { }
