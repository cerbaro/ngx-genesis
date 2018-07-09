import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnsoComponent } from './enso/enso.component';
import { EnsoRoutingModule } from './enso-routing.module';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';

@NgModule({
    imports: [
        CommonModule,
        EnsoRoutingModule,

        LayoutComponentsModule
    ],
    declarations: [EnsoComponent]
})
export class EnsoModule { }
