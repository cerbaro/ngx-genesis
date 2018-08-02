import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';

@NgModule({
    imports: [
        CommonModule,
        LayoutComponentsModule
    ],
    declarations: [
        DialogComponent
    ],
    entryComponents: [
        DialogComponent
    ],
    exports: [
        DialogComponent
    ]
})
export class DialogModule { }
