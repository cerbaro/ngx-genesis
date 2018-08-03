import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { FarmsRoutingModule } from './farms-routing.module';
import { FarmService } from 'src/app/shared/services/cds/farm.service';
import { FarmsComponent } from './farms/farms.component';

@NgModule({
    imports: [
        CommonModule,
        FarmsRoutingModule,

        ReactiveFormsModule,
        FormsModule,
        LayoutComponentsModule
    ],
    declarations: [
        FarmsComponent
    ],
    providers: [FarmService]
})
export class FarmsModule { }
