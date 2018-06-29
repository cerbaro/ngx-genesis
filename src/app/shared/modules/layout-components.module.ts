import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatToolbarModule,
    MatButtonModule,
    MatCardModule
} from '@angular/material';

@NgModule({
    imports: [
        FlexLayoutModule,

        MatToolbarModule,
        MatButtonModule,
        MatCardModule
    ],
    exports: [
        FlexLayoutModule,

        MatToolbarModule,
        MatButtonModule,
        MatCardModule
    ],
})
export class LayoutComponentsModule { }
