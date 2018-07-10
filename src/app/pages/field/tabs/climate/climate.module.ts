import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClimateComponent } from './climate/climate.component';
import { ClimateRoutingModule } from './climate-routing.module';

@NgModule({
    imports: [
        CommonModule,

        ClimateRoutingModule
    ],
    declarations: [
        ClimateComponent
    ]
})
export class ClimateModule { }
