import { NgModule } from '@angular/core';

import { RoundPipe } from '../pipes/round.pipe';

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
    MatAutocompleteModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogModule
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
        MatAutocompleteModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatBadgeModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatDialogModule
    ],
    declarations: [
        RoundPipe
    ],
    exports: [
        RoundPipe,
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
        MatAutocompleteModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatBadgeModule,
        MatProgressBarModule,
        MatTooltipModule,
        MatDialogModule
    ],
})
export class LayoutComponentsModule { }
