import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FieldComponent } from './field/field.component';
import { ManageComponent } from './manage/manage.component';

const withoutSeason: Routes = [
    { path: '', redirectTo: 'weather', pathMatch: 'full' },
    { path: 'weather', loadChildren: './tabs/weather/weather.module#WeatherModule' },
    { path: 'climate', loadChildren: './tabs/climate/climate.module#ClimateModule' },
    { path: 'satellite', loadChildren: './tabs/satellite/satellite.module#SatelliteModule' }
];
const withSeason: Routes = [
    ...withoutSeason,
    { path: 'phenology', loadChildren: './tabs/phenology/phenology.module#PhenologyModule' }
];

const routes: Routes = [
    { path: 'new', component: ManageComponent },
    { path: ':field/edit', component: ManageComponent },

    { path: ':field', component: FieldComponent, children: withoutSeason },
    { path: ':field/season/:season', component: FieldComponent, children: withSeason },

    { path: '**', component: FieldComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FieldRoutingModule { }
