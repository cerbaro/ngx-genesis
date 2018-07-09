import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FieldComponent } from './field/field.component';

const routes: Routes = [
    { path: '', component: FieldComponent },
    { path: '**', component: FieldComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FieldRoutingModule { }
