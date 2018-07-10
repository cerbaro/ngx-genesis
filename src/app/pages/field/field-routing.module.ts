import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FieldComponent } from './field/field.component';

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
    { path: '**', component: FieldComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FieldRoutingModule { }
