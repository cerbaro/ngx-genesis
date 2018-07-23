import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';

import { Field } from 'src/app/shared/types/field';
import { MapBoxService } from 'src/app/shared/services/map-box.service';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { FieldService } from 'src/app/shared/services/cds/field.service';
import { takeUntil, map } from 'rxjs/operators';
import { SocialService } from 'src/app/shared/services/cds/social.service';

interface Filter {
    _id: string;
    name: string;
    email?: string;
    status: boolean;
}

interface Filters {
    user: Array<Filter>;
    farm: Array<Filter>;
    commodity: Array<Filter>;
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
export class FieldsComponent extends NgxgRequest implements OnInit {

    public fieldsLoading: Boolean = true;
    public fields: Array<Field> = Array();

    public filters: Filters;
    public filterBy: any;

    public map: Map;

    constructor(
        private ngxgLoadingService: NgxgLoadingService,
        private mapBoxService: MapBoxService,
        private fieldService: FieldService,
        private socialService: SocialService
    ) {
        super();

        this.filters = {
            user: [],
            farm: [],
            commodity: [],
            season: []
        };

        this.filterBy = {
            users: [{ user: { _id: { $or: [] } } }],
            // farm: { $or: [] }
            // commodity: { $or: [] },
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


        this.fieldService.getFieldsWithSeasons()
            .pipe(
                takeUntil(this.ngxgUnsubscribe)
            )
            .subscribe(
                result => this.fieldsLoaded(result.data),
                error => this.setError(error)
            );

        // this.fields = [];
        // for (let i = 0; i <= 15; i++) {

        //     this.fields.push({
        //         name: 'Jabotirama ' + i % 2,
        //         act: true,
        //         admin: true,
        //         area: { shape: { type: 'geometry', coordinates: [1, 2, 3] }, size: 1000 },
        //         elev: 0,
        //         farm: 'Jabotirama ' + i % 2,
        //         weatherStations: [],
        //         inclination: 0,
        //         location: { geoid: 'BRRSPFB', lat: -28, lon: -52 },
        //         pvt: true,
        //         users: [{ admin: true, user: 'Vinicius ' + i % 2 }],

        //         app: {
        //             thumbnail: this.mapBoxService.getTileImageURL([-28, -52])
        //         }
        //     });

        // }

    }

    private fieldsLoaded(fields: Array<Field>): void {

        this.fields = fields;

        this.fields.forEach(field => {
            field.app = {
                thumbnail: this.mapBoxService.getTileImageURL([-28, -52])
            };
        });

        console.log(this.fields);

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
            commodity: [],
            season: []
        };

        this.fields.map(field => {

            this.filters.user.push(
                ...field.users
                    .filter(user => this.filters.user.findIndex(usr => usr._id === user.user._id) === -1)
                    .map(users => ({ _id: users.user._id, name: users.user.name, email: users.user.email, status: true }))
            );

            // if (this.filters.farm.findIndex(farm => farm._id === field._id) === -1) {
            //     this.filters.farm.push({ _id: field.farm, name: field.farm, status: true });
            // }

        });

        console.log(this.fields, this.filters.user);


        this.refreshFilters('user');
        // this.refreshFilters('farm');

        setTimeout(() => {
            this.fieldsLoading = false;
            this.ngxgLoadingService.setLoading(this.fieldsLoading);
        }, 2000);

    }

    public filterChange(fltr, selectedOptions) {

        const selected = selectedOptions.selected.map(sel => sel.value);

        if (fltr === 'user') {
            this.filterBy.users[0].user._id.$or = selected;
        } else {
            this.filterBy[fltr].$or = selected;
        }

        console.log(selected, this.filterBy);

        if (selected.length === 0) {
            this.refreshFilters(fltr);
        }

    }

    public refreshFilters(fltr: string): void {

        if (fltr === 'user') {
            this.filterBy.users[0].user._id.$or = this.filters.user.filter(user => user.status === true).map(filter => filter._id);
        } else {
            this.filterBy[fltr].$or = this.filters[fltr].filter(item => item.status === true).map(filter => filter._id);
        }

        // this.filterBy = {
        //     users: [{ user: { $or: this.filters.user.filter(user => user.status === true).map(filter => filter.id) } }],
        //     farm: { $or: this.filters.farm.filter(farm => farm.status === true).map(filter => filter.id) },
        //     // commodity: { $or: this.filters.commodity.filter(commodity => commodity.status === false).map(filter => filter.id) },
        //     // season: { $or: this.filters.season.filter(season => season.status === false).map(filter => filter.id) }
        // };

    }

}
