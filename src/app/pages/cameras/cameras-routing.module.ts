import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CamerasComponent } from './cameras/cameras.component';

const routes: Routes = [
    { path: '', component: CamerasComponent },
    { path: '**', component: CamerasComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CamerasRoutingModule { }
