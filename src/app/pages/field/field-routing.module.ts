import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FieldComponent } from './field/field.component';
import { WeatherComponent } from './tabs/weather/weather.component';
import { ClimateComponent } from './tabs/climate/climate.component';
import { SatelliteComponent } from './tabs/satellite/satellite.component';
import { PhenologyComponent } from './tabs/phenology/phenology.component';

const routes: Routes = [
    {
        path: '', component: FieldComponent,
        children: [
            { path: '', redirectTo: 'weather', pathMatch: 'full' },
            { path: 'weather', component: WeatherComponent },
            { path: 'climate', component: ClimateComponent },
            { path: 'satellite', component: SatelliteComponent },
            { path: 'phenology', component: PhenologyComponent }
        ]
    },
    { path: '**', component: FieldComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FieldRoutingModule { }
