import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FieldComponent } from './field/field.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
    {
        path: '', component: FieldComponent,
        children: [
            { path: '', redirectTo: 'weather', pathMatch: 'full' },
            { path: 'weather', loadChildren: './tabs/weather/weather.module#WeatherModule' },
            { path: 'climate', loadChildren: './tabs/climate/climate.module#ClimateModule' },
            { path: 'satellite', loadChildren: './tabs/satellite/satellite.module#SatelliteModule' },
            { path: 'phenology', loadChildren: './tabs/phenology/phenology.module#PhenologyModule' }
        ]
    },
    { path: 'new', component: ManageComponent },
    // { path: ':field/season', loadChildren: '../season/season.module#SeasonModule' },
    // { path: ':field/season/:season', loadChildren: '../season/season.module#SeasonModule' },
    { path: ':id/edit', component: ManageComponent },
    { path: '**', component: FieldComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FieldRoutingModule { }
