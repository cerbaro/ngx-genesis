import { Injectable } from '@angular/core';
import * as L from 'leaflet';

export class LeafletLocate {

    private maxZoom: Number = 15;

    constructor(private map: any) {
    }

    initializeControls() {

        const lc = L.control.locate(
            {
                position: 'topleft',
                strings: {
                    title: 'Mostre-me onde estou.'
                },
                locateOptions: {
                    setView: true,
                    maxZoom: <any>this.maxZoom
                }
            }
        ).addTo(this.map);

    }

}
