import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main/main.component';

import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { DataExchangeService } from 'src/app/shared/services/data-exchange.service';

@NgModule({
    imports: [
        CommonModule,
        MainRoutingModule,

        LayoutComponentsModule
    ],
    declarations: [MainComponent],
    providers: [
        NgxgLoadingService,
        DataExchangeService
    ]
})
export class MainModule { }
