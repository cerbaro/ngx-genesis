import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnsoComponent } from './enso/enso.component';

const routes: Routes = [
    { path: '', component: EnsoComponent },
    { path: '**', component: EnsoComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EnsoRoutingModule { }
