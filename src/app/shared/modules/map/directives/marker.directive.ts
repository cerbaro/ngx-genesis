import { Directive, EventEmitter, ContentChild, Input, Output } from '@angular/core';
import { LeafletService } from '../services/leaflet.service';
import { PopupDirective } from './popup.directive';

import * as mapTypes from '../map.types';
import * as L from 'leaflet';

let markerId = 0;

@Directive({
    selector: '[ngxgMarker]'
})
export class MarkerDirective {

    private id: string;
    private llMarker: L.Marker;

    @Input() options: mapTypes.MarkerOptions;
    @Output() click: EventEmitter<mapTypes.MarkerOptions> = new EventEmitter<mapTypes.MarkerOptions>();

    @ContentChild(PopupDirective) popup: PopupDirective;

    constructor(private leafletService: LeafletService) {
        this.id = (markerId++).toString();
    }

    public init(): void {
        this.leafletService.addMarker(this).subscribe(marker => {
            this.llMarker = marker;

            if (this.hasPopup()) {
                this.bindPopup();
                this.popup.init();
            }

            this.addEvents();
        });
    }

    private addEvents(): void {
        this.leafletService.createMarkerObservable('click', this).subscribe(() => {
            if (this.hasPopup()) {
                this.popup.open();
            }

            this.click.emit(this.options);
        });
    }

    private bindPopup(): void {
        this.leafletService.bindPopup(this.llMarker, this.popup).subscribe();
    }

    private hasPopup(): boolean {
        return typeof (this.popup) !== 'undefined';
    }

}
