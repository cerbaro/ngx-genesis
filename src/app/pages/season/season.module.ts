import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SeasonRoutingModule } from './season-routing.module';
import { ManageComponent } from './manage/manage.component';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';


@NgModule({
    imports: [
        CommonModule,
        SeasonRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        LayoutComponentsModule
    ],
    declarations: [ManageComponent]
})
export class SeasonModule { }
