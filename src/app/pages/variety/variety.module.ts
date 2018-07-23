import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage/manage.component';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VarietyRoutingModule } from 'src/app/pages/variety/variety-routing.module';

@NgModule({
    imports: [
        CommonModule,
        VarietyRoutingModule,

        ReactiveFormsModule,
        FormsModule,
        LayoutComponentsModule
    ],
    declarations: [ManageComponent]
})
export class VarietyModule { }
