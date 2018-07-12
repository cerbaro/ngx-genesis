import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhenologyComponent } from './phenology/phenology.component';
import { PhenologyRoutingModule } from './phenology-routing.module';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';

import { ChartModule } from '@kiwigrid/ngx-highcharts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
    imports: [
        CommonModule,
        PhenologyRoutingModule,
        LayoutComponentsModule,

        ChartModule,
        LeafletModule
    ],
    declarations: [
        PhenologyComponent
    ]
})
export class PhenologyModule { }
