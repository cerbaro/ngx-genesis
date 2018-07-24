import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';

import { Field } from 'src/app/shared/types/field';
import { MapBoxService } from 'src/app/shared/services/map-box.service';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { FieldService } from 'src/app/shared/services/cds/field.service';
import { takeUntil } from 'rxjs/operators';

interface Filter {
    _id: string;
    name: string;
    email?: string;
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

    public allFields: Array<Field> = Array();
    public fields: Array<Field> = Array();

    public filters: Filters = {
        user: [],
        farm: [],
        commodity: [],
        season: []
    };

    public filterBy: any = {
        user: [],
        farm: [],
        commodity: [],
        season: []
    };

    public map: Map;

    constructor(
        private ngxgLoadingService: NgxgLoadingService,
        private mapBoxService: MapBoxService,
        private fieldService: FieldService
    ) {
        super();
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

        this.allFields = fields;

        this.allFields.forEach(field => {
            field.app = {
                thumbnail: this.mapBoxService.getTileImageURL([field.location.lat, field.location.lon])
            };
        });

        console.log(this.allFields);

        this.allFields.map(field => {

            this.filters.user.push(
                ...field.users
                    .filter(user => this.filters.user.findIndex(usr => usr._id === user.user._id) === -1)
                    .map(users => ({ _id: users.user._id, name: users.user.name, email: users.user.email }))
            );

            if (field.farm !== null && this.filters.farm.findIndex(farm => farm._id === field.farm._id) === -1) {
                this.filters.farm.push({ _id: field.farm._id, name: field.farm.name });
            }

        });

        this.filterFields();

        this.fieldsLoading = false;
        this.ngxgLoadingService.setLoading(this.fieldsLoading);

    }

    public filterFields(): void {

        this.fields =
            this.allFields
                .filter(field =>
                    this.filterBy.user.length === 0 ||
                    field.users.filter(user =>
                        this.filterBy.user.includes(user.user._id)).length === this.filterBy.user.length
                )
                .filter(field => this.filterBy.farm.length === 0 || this.filterBy.farm.includes(field.farm._id))
                .filter(field => this.filterBy.commodity.length === 0 || this.filterBy.commodity.includes(field.app.season._id));

    }

    public filterChange(fltr, selectedOptions) {

        this.filterBy[fltr] = selectedOptions.selected.map(sel => sel.value);
        this.filterFields();

    }

}
