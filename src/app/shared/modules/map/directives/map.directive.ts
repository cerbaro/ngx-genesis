import {
    Directive,
    Renderer2,
    ElementRef,
    OnInit,
    Input,
    ContentChildren,
    QueryList,
    AfterContentInit,
    Output,
    EventEmitter
} from '@angular/core';

import { LeafletService } from '../services/leaflet.service';
import { MarkerDirective } from './marker.directive';
import { GeoJSONDirective } from './geojson.directive';
import { Subscription } from 'rxjs';

import * as mapTypes from '../map.types';
import * as L from 'leaflet';

@Directive({
    selector: '[ngxgMap]',
    providers: [LeafletService]
})
export class MapDirective implements OnInit, AfterContentInit {

    private id: string;
    private map: L.Map;
    private baseMaps: any;
    private drawMonitor: Subscription;

    @Output()
    private mapInstance: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    private options: mapTypes.MapOptions;

    @Input()
    private draw: any;

    @Output()
    private drawSaved: EventEmitter<any> = new EventEmitter<any>();

    @ContentChildren(MarkerDirective) markers: QueryList<MarkerDirective> = new QueryList<MarkerDirective>();
    @ContentChildren(GeoJSONDirective) geoJSONs: QueryList<GeoJSONDirective> = new QueryList<GeoJSONDirective>();

    constructor(private element: ElementRef, private renderer: Renderer2, private leafletService: LeafletService) {
        this.id = element.nativeElement.id;

        /*
         * It makes possible to have multiple maps in the same page
         */

        this.createMapContainer(element);

    }

    private createMapContainer(element: ElementRef): void {
        const map = this.renderer.createElement('div');
        this.renderer.setAttribute(map, 'id', this.mapId());
        this.renderer.setStyle(map, 'height', '100%');
        this.renderer.appendChild(element.nativeElement, map);
    }

    private mapId(): string {
        return this.id + '-inner';
    }

    ngOnInit() { }

    ngAfterContentInit() {

        this.leafletService.initMap(this.mapId(), this.options).subscribe(map => {
            this.map = map;

            this.loadGeoJSON(this.geoJSONs);
            this.loadMarkers(this.markers);
            this.leafletService.fitMapTo(this.options.fitMapTo);

            if (this.options.controls.draw) {
                this.addEvents();
            }

            this.mapInstance.emit(this.map);

        });
    }

    private addEvents() {
        this.drawMonitor = this.leafletService.drawMonitor().subscribe(
            layers => {
                this.drawSaved.emit(layers);
            });
    }

    private loadMarkers(markers: QueryList<MarkerDirective>): void {
        markers.forEach(marker => {
            marker.init();
        });
    }

    private loadGeoJSON(geoJSONs: QueryList<GeoJSONDirective>): void {
        geoJSONs.forEach(geojson => {
            geojson.init();
        });
    }

}


