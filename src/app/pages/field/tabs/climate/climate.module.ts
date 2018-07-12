import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClimateComponent } from './climate/climate.component';
import { ClimateRoutingModule } from './climate-routing.module';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';

import { ChartModule } from '@kiwigrid/ngx-highcharts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
    imports: [
        CommonModule,
        ClimateRoutingModule,
        LayoutComponentsModule,

        ChartModule,
        LeafletModule
    ],
    declarations: [
        ClimateComponent
    ]
})
export class ClimateModule { }
