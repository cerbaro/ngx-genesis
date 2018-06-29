import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main/main.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatToolbarModule,
    MatIconModule
} from '@angular/material';


@NgModule({
    imports: [
        CommonModule,
        MainRoutingModule,

        FlexLayoutModule,
        MatToolbarModule,
        MatIconModule
    ],
    declarations: [MainComponent]
})
export class MainModule { }
