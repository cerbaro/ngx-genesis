import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FarmsComponent } from './farms/farms.component';

const routes: Routes = [
    { path: '', component: FarmsComponent },
    { path: '**', component: FarmsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FarmsRoutingModule { }
