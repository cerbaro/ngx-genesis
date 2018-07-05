import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDividerModule
} from '@angular/material';

@NgModule({
    imports: [
        FlexLayoutModule,

        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatDividerModule
    ],
    exports: [
        FlexLayoutModule,

        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatDividerModule
    ],
})
export class LayoutComponentsModule { }
