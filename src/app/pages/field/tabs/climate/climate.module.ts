import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ClimateComponent } from './climate/climate.component';
import { ClimateRoutingModule } from './climate-routing.module';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';

import { ChartModule } from '@kiwigrid/ngx-highcharts';
import { MapModule } from 'src/app/shared/modules/map/map.module';
import { AgroGISService } from 'src/app/shared/services/agrogis/agrogis.service';

@NgModule({
    imports: [
        CommonModule,
        ClimateRoutingModule,
        LayoutComponentsModule,

        ChartModule,
        MapModule
    ],
    declarations: [
        ClimateComponent
    ],
    providers: [
        AgroGISService,
        DatePipe
    ]
})
export class ClimateModule { }
