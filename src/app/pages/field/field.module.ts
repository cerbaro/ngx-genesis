import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldRoutingModule } from './field-routing.module';
import { FieldComponent } from './field/field.component';

import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { MapBoxService } from 'src/app/shared/services/map-box.service';
import { TabLoadingService } from './utils/tab-loading.service';
import { MapModule } from 'src/app/shared/modules/map/map.module';

@NgModule({
    imports: [
        CommonModule,
        FieldRoutingModule,

        LayoutComponentsModule,
        MapModule
    ],
    declarations: [
        FieldComponent
    ],
    providers: [
        MapBoxService,
        TabLoadingService
    ]
})
export class FieldModule { }
