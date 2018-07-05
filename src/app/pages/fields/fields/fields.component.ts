import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';

@Component({
    templateUrl: './fields.component.html',
    styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {

    public fieldsLoading: Boolean;

    public options = {
        layers: [
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
        ],
        zoom: 5,
        center: L.latLng(46.879966, -121.726909)
    };

    constructor() {
        this.fieldsLoading = false;
    }

    ngOnInit() {
    }

}
