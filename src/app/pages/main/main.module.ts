import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main/main.component';

import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';

@NgModule({
    imports: [
        CommonModule,
        MainRoutingModule,

        LayoutComponentsModule
    ],
    declarations: [MainComponent],
    providers: [
        NgxgLoadingService
    ]
})
export class MainModule { }
