import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            { path: '', redirectTo: '/fields', pathMatch: 'full' },
            { path: 'fields', loadChildren: '../fields/fields.module#FieldsModule' },
            { path: 'field', loadChildren: '../field/field.module#FieldModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule { }
