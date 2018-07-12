import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';

import { Field } from 'src/app/shared/types/field';
import { MapBoxService } from 'src/app/shared/services/map-box.service';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';

@Component({
    templateUrl: './fields.component.html',
    styleUrls: ['./fields.component.scss']
})
export class FieldsComponent extends NgxgUnsubscribe implements OnInit {

    public fieldsLoading: Boolean;

    public fields: Array<Field>;

    public options = {
        layers: [
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
        ],
        zoom: 5,
        center: L.latLng(46.879966, -121.726909)
    };

    constructor(
        private ngxgLoadingService: NgxgLoadingService,
        private mapBoxService: MapBoxService
    ) {
        super();

        this.fieldsLoading = true;
    }

    ngOnInit() {

        /**
         * Timeout to avoid Error
         * ExpressionChangedAfterItHasBeenCheckedError
         */

        setTimeout(() => {
            this.ngxgLoadingService.setLoading(this.fieldsLoading);
        });

        this.fields = [];
        for (let i = 0; i <= 5; i++) {

            this.fields.push({
                name: 'Jabotirama ' + i,
                act: true,
                admin: true,
                area: { shape: { type: 'geometry', coordinates: [1, 2, 3] }, size: 1000 },
                elev: 0,
                farm: '',
                weatherStations: [],
                inclination: 0,
                location: { geoid: 'BRRSPFB', lat: -52, lon: -28 },
                pvt: true,
                users: [{ admin: true, user: 'Vinicius' }],

                app: {
                    thumbnail: this.mapBoxService.getTileImageURL([-28, -52])
                }
            });
        }

        setTimeout(() => {
            this.fieldsLoading = false;
            this.ngxgLoadingService.setLoading(this.fieldsLoading);
        }, 2000);

    }


    public openFilter(event) {
        console.log('Event', event);
    }

}
