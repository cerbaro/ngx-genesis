import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClimateComponent } from './climate/climate.component';

const routes: Routes = [
    { path: '', component: ClimateComponent },
    { path: '**', component: ClimateComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClimateRoutingModule { }
