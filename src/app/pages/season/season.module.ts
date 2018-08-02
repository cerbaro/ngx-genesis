import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SeasonRoutingModule } from './season-routing.module';
import { ManageComponent } from './manage/manage.component';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { VarietiesResolveService } from 'src/app/shared/services/resolvers/varieties-resolve.service';
import { CommoditiesResolveService } from 'src/app/shared/services/resolvers/commodities-resolve.service';
import { SeasonService } from 'src/app/shared/services/cds/season.service';
import { VarietyService } from 'src/app/shared/services/cds/variety.service';
import { CommodityService } from 'src/app/shared/services/cds/commodity.service';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

@NgModule({
    imports: [
        CommonModule,
        SeasonRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        LayoutComponentsModule
    ],
    declarations: [
        ManageComponent
    ],
    providers: [
        SeasonService,
        CommodityService,
        VarietyService,
        CommoditiesResolveService,
        VarietiesResolveService,

        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
    ]
})
export class SeasonModule { }
