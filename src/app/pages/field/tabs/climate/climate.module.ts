import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClimateComponent } from './climate/climate.component';
import { ClimateRoutingModule } from './climate-routing.module';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';

@NgModule({
    imports: [
        CommonModule,

        ClimateRoutingModule,

        LayoutComponentsModule
    ],
    declarations: [
        ClimateComponent
    ]
})
export class ClimateModule { }
