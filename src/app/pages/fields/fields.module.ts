import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FieldsRoutingModule } from './fields-routing.module';
import { FieldsComponent } from './fields/fields.component';

import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { MapBoxService } from 'src/app/shared/services/map-box.service';

import { MdePopoverModule } from '@material-extended/mde';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { MapModule } from 'src/app/shared/modules/map/map.module';
import { FieldService } from 'src/app/shared/services/cds/field.service';

@NgModule({
    imports: [
        CommonModule,
        FieldsRoutingModule,

        LayoutComponentsModule,
        MapModule,
        MdePopoverModule,
        FilterPipeModule
    ],
    declarations: [
        FieldsComponent
    ],
    providers: [
        MapBoxService,
        FieldService
    ]
})
export class FieldsModule { }
