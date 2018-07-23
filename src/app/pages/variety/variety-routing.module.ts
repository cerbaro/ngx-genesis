import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
    { path: 'new', component: ManageComponent },
    { path: '', redirectTo: 'new', pathMatch: 'full' },
    { path: '**', component: ManageComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VarietyRoutingModule { }
