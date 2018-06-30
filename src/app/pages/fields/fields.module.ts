import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldsRoutingModule } from './fields-routing.module';
import { FieldsComponent } from './fields/fields.component';

import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
    imports: [
        CommonModule,
        FieldsRoutingModule,

        LayoutComponentsModule,

        LeafletModule
    ],
    declarations: [FieldsComponent]
})
export class FieldsModule { }
