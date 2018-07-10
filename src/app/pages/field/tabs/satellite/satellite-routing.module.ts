import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SatelliteComponent } from './satellite/satellite.component';

const routes: Routes = [
    { path: '', component: SatelliteComponent },
    { path: '**', component: SatelliteComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SatelliteRoutingModule { }
