import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import * as moment from 'moment';

import { Field } from 'src/app/shared/types/field';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { FieldService } from 'src/app/shared/services/cds/field.service';
import { takeUntil } from 'rxjs/operators';
import { LeafletService } from 'src/app/shared/modules/map/services/leaflet.service';

interface Filter {
    _id: string;
    name: string;
    email?: string;
}

interface Filters {
    user: Array<Filter>;
    farm: Array<Filter>;
    commodity: Array<Filter>;
    variety: Array<Filter>;
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
        variety: []
    };

    public filterBy: any = {
        user: [],
        farm: [],
        commodity: [],
        variety: []
    };

    public map: Map;

    constructor(
        private ngxgLoadingService: NgxgLoadingService,
        private leafLetService: LeafletService,
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

    private findPrevSeason(seasons: any): any {

        const sFiltered = seasons
            .filter(season => {
                const dCur = (season.phenology != null) ? season.phenology.current.harvestingDate : season.harvestingDate;
                return moment(dCur as Date).isBefore(moment());
            });

        if (sFiltered.length > 0) {
            return sFiltered.reduce((reg, season) => {
                const dReg = (reg.phenology != null) ? reg.phenology.current.harvestingDate : reg.harvestingDate;
                const dCur = (season.phenology != null) ? season.phenology.current.harvestingDate : season.harvestingDate;

                return ((moment(dCur as Date).isAfter(moment(dReg as Date))) ? season : reg);

            }, sFiltered[0]);
        } else {
            return null;
        }
    }

    private findCurrentSeason(seasons: any): any {

        const sFiltered = seasons
            .filter(season => {
                const pCur = (season.phenology != null) ? season.phenology.current.plantingDate : season.plantingDate;
                const hCur = (season.phenology != null) ? season.phenology.current.harvestingDate : season.harvestingDate;
                return moment(pCur as Date).isBefore(moment()) && moment(hCur as Date).isAfter(moment());
            });

        if (sFiltered.length > 0) {
            return sFiltered.reduce((reg, season) => {
                const dReg = (reg.phenology != null) ? reg.phenology.current.plantingDate : reg.plantingDate;
                const dCur = (season.phenology != null) ? season.phenology.current.plantingDate : season.plantingDate;

                return ((moment(dCur as Date).isAfter(moment(dReg as Date))) ? season : reg);

            }, sFiltered[0]);
        } else {
            return null;
        }
    }

    private findNextSeason(seasons: any): any {

        const sFiltered = seasons
            .filter(season => {
                const dCur = (season.phenology != null) ? season.phenology.current.plantingDate : season.plantingDate;
                return moment(dCur as Date).isAfter(moment());
            });

        if (sFiltered.length > 0) {
            return sFiltered.reduce((reg, season) => {
                const dReg = (reg.phenology != null) ? reg.phenology.current.plantingDate : reg.plantingDate;
                const dCur = (season.phenology != null) ? season.phenology.current.plantingDate : season.plantingDate;

                return ((moment(dCur as Date).isBefore(moment(dReg as Date))) ? season : reg);

            }, sFiltered[0]);
        } else {
            return null;
        }
    }


    private fieldsLoaded(fields: Array<Field>): void {

        this.allFields = fields;

        this.allFields.forEach(field => {
            field.app = {
                thumbnail: this.leafLetService.getTileImageURL([field.location.lat, field.location.lon], {
                    'type': 'FeatureCollection',
                    'features': [{
                        'type': 'Feature',
                        'geometry': {
                            'type': field.area.shape.type,
                            'coordinates': field.area.shape.coordinates
                        },
                        'properties': {
                            'fill': 'EBD740',
                            'fill-opacity': '.3',
                            'stroke': 'EBD140'
                        }
                    }]
                })
            };

            if (field.farm === null) {
                field.farm = { _id: null };
            }

            field.app.season = {};
            field.app.season.prev = this.findPrevSeason(field.seasons);
            field.app.season.current = this.findCurrentSeason(field.seasons);
            field.app.season.next = this.findNextSeason(field.seasons);

        });

        this.allFields.map(field => {

            this.filters.user.push(
                ...field.users
                    .filter(user => this.filters.user.findIndex(usr => usr._id === user.user._id) === -1)
                    .map(users => ({ _id: users.user._id, name: users.user.name, email: users.user.email }))
            );

            if (field.farm._id !== null && this.filters.farm.findIndex(farm => farm._id === field.farm._id) === -1) {
                this.filters.farm.push({ _id: field.farm._id, name: field.farm.name });
            }

            if (field.app.season.current != null &&
                this.filters.commodity.findIndex(commodity => commodity._id === field.app.season.current.commodity._id) === -1) {
                this.filters.commodity.push({ _id: field.app.season.current.commodity._id, name: field.app.season.current.commodity.name });
            }

            if (field.app.season.current != null &&
                this.filters.variety.findIndex(variety => variety._id === field.app.season.current.variety._id) === -1) {
                this.filters.variety.push({ _id: field.app.season.current.variety._id, name: field.app.season.current.variety.name });
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
                .filter(field => this.filterBy.commodity.length === 0 ||
                    (field.app.season.current != null && this.filterBy.commodity.includes(field.app.season.current.commodity._id))
                )
                .filter(field => this.filterBy.variety.length === 0 ||
                    (field.app.season.current != null && this.filterBy.variety.includes(field.app.season.current.variety._id))
                );

    }

    public filterChange(fltr, selectedOptions) {

        this.filterBy[fltr] = selectedOptions.selected.map(sel => sel.value);
        this.filterFields();

    }

}
