import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhenologyComponent } from './phenology/phenology.component';

const routes: Routes = [
    { path: '', component: PhenologyComponent },
    { path: '**', component: PhenologyComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PhenologyRoutingModule { }
