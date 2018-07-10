import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SatelliteComponent } from './satellite/satellite.component';
import { SatelliteRoutingModule } from './satellite-routing.module';


@NgModule({
    imports: [
        CommonModule,

        SatelliteRoutingModule
    ],
    declarations: [
        SatelliteComponent
    ]
})
export class SatelliteModule { }
