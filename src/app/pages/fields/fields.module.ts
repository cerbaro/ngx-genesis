import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { FieldsRoutingModule } from './fields-routing.module';
import { FieldsComponent } from './fields/fields.component';

import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { MapBoxService } from 'src/app/shared/services/map-box.service';

import { MdePopoverModule } from '@material-extended/mde';
import { FilterPipeModule } from 'ngx-filter-pipe';

@NgModule({
    imports: [
        CommonModule,
        FieldsRoutingModule,

        LayoutComponentsModule,
        LeafletModule,
        MdePopoverModule,
        FilterPipeModule
    ],
    declarations: [
        FieldsComponent
    ],
    providers: [
        MapBoxService
    ]
})
export class FieldsModule { }
