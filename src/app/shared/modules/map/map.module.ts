import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as L from 'leaflet';
import 'leaflet.locatecontrol';
import 'leaflet-draw';
import 'leaflet.markercluster';

import { MapDirective } from './directives/map.directive';
import { MarkerDirective } from './directives/marker.directive';
import { GeoJSONDirective } from './directives/geojson.directive';
import { PopupDirective } from './directives/popup.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        MapDirective,
        MarkerDirective,
        GeoJSONDirective,
        PopupDirective
    ],
    exports: [
        MapDirective,
        MarkerDirective,
        GeoJSONDirective,
        PopupDirective
    ]
})
export class MapModule { }
