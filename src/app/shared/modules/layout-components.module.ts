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
    MatDividerModule,
    MatSelectModule,
    MatMenuModule,
    MatCheckboxModule,
    MatChipsModule,
    MatAutocompleteModule
} from '@angular/material';

@NgModule({
    imports: [
        FlexLayoutModule,

        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatDividerModule,
        MatMenuModule,
        MatCheckboxModule,
        MatChipsModule,
        MatAutocompleteModule
    ],
    exports: [
        FlexLayoutModule,

        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatDividerModule,
        MatMenuModule,
        MatCheckboxModule,
        MatChipsModule,
        MatAutocompleteModule
    ],
})
export class LayoutComponentsModule { }
