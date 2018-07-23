import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage/manage.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { FarmRoutingModule } from './farm-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FarmRoutingModule,

        ReactiveFormsModule,
        FormsModule,
        LayoutComponentsModule
    ],
    declarations: [ManageComponent]
})
export class FarmModule { }
