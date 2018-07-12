import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhenologyComponent } from './phenology/phenology.component';
import { PhenologyRoutingModule } from './phenology-routing.module';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';

@NgModule({
    imports: [
        CommonModule,

        PhenologyRoutingModule,

        LayoutComponentsModule
    ],
    declarations: [
        PhenologyComponent
    ]
})
export class PhenologyModule { }
