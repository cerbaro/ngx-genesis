import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhenologyComponent } from './phenology/phenology.component';
import { PhenologyRoutingModule } from './phenology-routing.module';

@NgModule({
    imports: [
        CommonModule,

        PhenologyRoutingModule
    ],
    declarations: [
        PhenologyComponent
    ]
})
export class PhenologyModule { }
