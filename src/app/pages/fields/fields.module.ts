import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FieldsRoutingModule } from './fields-routing.module';
import { FieldsComponent } from './fields/fields.component';

import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';

import { MdePopoverModule } from '@material-extended/mde';

import { MapModule } from 'src/app/shared/modules/map/map.module';
import { FieldService } from 'src/app/shared/services/cds/field.service';
import { SocialService } from 'src/app/shared/services/cds/social.service';
import { LeafletService } from 'src/app/shared/modules/map/services/leaflet.service';
import { CommodityService } from 'src/app/shared/services/cds/commodity.service';
import { DarkskyService } from 'src/app/shared/services/cds/darksky.service';

@NgModule({
    imports: [
        CommonModule,
        FieldsRoutingModule,

        LayoutComponentsModule,
        MapModule,
        MdePopoverModule
    ],
    declarations: [
        FieldsComponent
    ],
    providers: [
        LeafletService,
        FieldService,
        CommodityService,
        DarkskyService,
        SocialService
    ]
})
export class FieldsModule { }
