import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldsRoutingModule } from './fields-routing.module';
import { FieldsComponent } from './fields/fields.component';

@NgModule({
    imports: [
        CommonModule,
        FieldsRoutingModule
    ],
    declarations: [FieldsComponent]
})
export class FieldsModule { }
