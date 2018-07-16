import { Directive, Input, Output, ContentChild, EventEmitter } from '@angular/core';
import { LeafletService } from '../services/leaflet.service';
import { PopupDirective } from './popup.directive';

import * as MapTypes from '../map.types';

@Directive({
    selector: '[ngxgGeoJson]'
})
export class GeoJSONDirective {

    private llgeojson: any;

    @Input()
    public options: MapTypes.GeojsonOptions;

    @Output()
    public click: EventEmitter<MapTypes.GeojsonOptions> = new EventEmitter<MapTypes.GeojsonOptions>();

    @ContentChild(PopupDirective) popup: PopupDirective;

    constructor(private leafletService: LeafletService) { }

    public init(): void {
        this.leafletService.addGeoJSON(this).subscribe(geojson => {
            this.llgeojson = geojson;

            if (this.hasPopup()) {
                this.bindPopup();
                this.popup.init();
            }

            this.addEvents();

            if (this.options.editable) {
                this.leafletService.loadDraw(this.llgeojson).subscribe();
            }

        });
    }

    private addEvents(): void {
        this.leafletService.createGeoJSONObservable('click', this).subscribe(() => {
            if (this.hasPopup()) {
                this.popup.open();
            }

            this.click.emit(this.options);
        });

    }

    private bindPopup(): void {
        this.leafletService.bindPopup(this.llgeojson, this.popup).subscribe();
    }

    private hasPopup(): boolean {
        return typeof (this.popup) !== 'undefined';
    }

}
