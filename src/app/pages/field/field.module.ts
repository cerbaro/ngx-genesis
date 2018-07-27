import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FieldRoutingModule } from './field-routing.module';
import { FieldComponent } from './field/field.component';

import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { TabLoadingService } from './utils/tab-loading.service';
import { MapModule } from 'src/app/shared/modules/map/map.module';
import { ManageComponent } from './manage/manage.component';
import { LeafletService } from 'src/app/shared/modules/map/services/leaflet.service';
import { FieldService } from 'src/app/shared/services/cds/field.service';
import { CommodityService } from 'src/app/shared/services/cds/commodity.service';
import { DarkskyService } from 'src/app/shared/services/cds/darksky.service';
import { SocialService } from 'src/app/shared/services/cds/social.service';
import { AgroGISService } from 'src/app/shared/services/agrogis/agrogis.service';

@NgModule({
    imports: [
        CommonModule,
        FieldRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        LayoutComponentsModule,
        MapModule
    ],
    declarations: [
        FieldComponent,
        ManageComponent
    ],
    providers: [
        TabLoadingService,
        LeafletService,
        FieldService,
        CommodityService,
        DarkskyService,
        AgroGISService,
        DatePipe,
        SocialService
    ]
})
export class FieldModule { }
