import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { FieldsRoutingModule } from './fields-routing.module';
import { FieldsComponent } from './fields/fields.component';

import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { MapBoxService } from 'src/app/shared/services/map-box.service';
import { FilterComponent } from './filter/filter.component';

@NgModule({
    imports: [
        CommonModule,
        FieldsRoutingModule,

        LayoutComponentsModule,
        LeafletModule
    ],
    declarations: [
        FieldsComponent,
        FilterComponent
    ],
    providers: [
        MapBoxService
    ]
})
export class FieldsModule { }
