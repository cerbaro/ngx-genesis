import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';

import { Field } from 'src/app/shared/types/field';
import { MapBoxService } from 'src/app/shared/services/map-box.service';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';

interface Filter {
    id: string;
    name: string;
    status: boolean;
}

interface Filters {
    user: Array<Filter>;
    farm: Array<Filter>;
    crop: Array<Filter>;
    season: Array<Filter>;
}

interface Map {
    options: any;
    instance?: any;
}

@Component({
    templateUrl: './fields.component.html',
    styleUrls: ['./fields.component.scss']
})
export class FieldsComponent extends NgxgUnsubscribe implements OnInit {

    public fieldsLoading: Boolean;
    public fields: Array<Field>;

    public filters: Filters;
    public filterBy: any;

    public map: Map;

    constructor(
        private ngxgLoadingService: NgxgLoadingService,
        private mapBoxService: MapBoxService
    ) {
        super();

        this.fieldsLoading = true;

        this.filters = {
            user: [],
            farm: [],
            crop: [],
            season: []
        };

        this.filterBy = {
            users: [{ user: { $or: [] } }],
            farm: { $or: [] }
            // crop: { $or: [] },
            // season: { $or: [] }
        };

        // console.log(this.filterBy);

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
        for (let i = 0; i <= 15; i++) {

            this.fields.push({
                name: 'Jabotirama ' + i % 2,
                act: true,
                admin: true,
                area: { shape: { type: 'geometry', coordinates: [1, 2, 3] }, size: 1000 },
                elev: 0,
                farm: 'Jabotirama ' + i % 2,
                weatherStations: [],
                inclination: 0,
                location: { geoid: 'BRRSPFB', lat: -28, lon: -52 },
                pvt: true,
                users: [{ admin: true, user: 'Vinicius ' + i % 2 }],

                app: {
                    thumbnail: this.mapBoxService.getTileImageURL([-28, -52])
                }
            });

        }

        this.map = {
            options: {
                layers: [
                    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
                ],
                zoom: 5,
                center: L.latLng(this.fields[0].location.lat, this.fields[0].location.lon)
            }
        } as Map;

        this.filters = {
            user: [],
            farm: [],
            crop: [],
            season: []
        };

        this.fields.map(field => {

            this.filters.user.push(
                ...field.users
                    .filter(user => this.filters.user.findIndex(usr => usr.id === user.user) === -1)
                    .map(users => ({ id: users.user, name: users.user, status: true }))
            );

            if (this.filters.farm.findIndex(farm => farm.id === field.farm) === -1) {
                this.filters.farm.push({ id: field.farm, name: field.farm, status: true });
            }

        });

        this.refreshFilters('user');
        this.refreshFilters('farm');

        setTimeout(() => {
            this.fieldsLoading = false;
            this.ngxgLoadingService.setLoading(this.fieldsLoading);
        }, 2000);

    }

    public filterChange(fltr, selectedOptions) {

        const selected = selectedOptions.selected.map(sel => sel.value);

        if (fltr === 'user') {
            this.filterBy.users[0].user.$or = selected;
        } else {
            this.filterBy[fltr].$or = selected;
        }

        if (selected.length === 0) {
            this.refreshFilters(fltr);
        }

    }

    public refreshFilters(fltr: string): void {

        if (fltr === 'user') {
            this.filterBy.users[0].user.$or = this.filters.user.filter(user => user.status === true).map(filter => filter.id);
        } else {
            this.filterBy[fltr].$or = this.filters[fltr].filter(item => item.status === true).map(filter => filter.id);
        }

        // this.filterBy = {
        //     users: [{ user: { $or: this.filters.user.filter(user => user.status === true).map(filter => filter.id) } }],
        //     farm: { $or: this.filters.farm.filter(farm => farm.status === true).map(filter => filter.id) },
        //     // crop: { $or: this.filters.crop.filter(crop => crop.status === false).map(filter => filter.id) },
        //     // season: { $or: this.filters.season.filter(season => season.status === false).map(filter => filter.id) }
        // };

    }

}
