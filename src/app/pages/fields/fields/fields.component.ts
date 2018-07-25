import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import * as moment from 'moment';

import { Field } from 'src/app/shared/types/field';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { FieldService } from 'src/app/shared/services/cds/field.service';
import { takeUntil } from 'rxjs/operators';
import { LeafletService } from 'src/app/shared/modules/map/services/leaflet.service';
import { CommodityService } from 'src/app/shared/services/cds/commodity.service';

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
        private fieldService: FieldService,
        private commodityService: CommodityService
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
            .pipe(takeUntil(this.ngxgUnsubscribe))
            .subscribe(
                result => this.fieldsLoaded(result.data),
                error => this.setError(error)
            );

    }

    private currentStage(season): any {

        let currentStage: any;
        let nextStage: any = null;

        const pdate = moment(season.plantingDate as string, 'YYYY-MM-DD');

        // this.commodityService
        //     .getPhenologyStages(season.commodity._id)
        //     .pipe(takeUntil(this.ngxgUnsubscribe))
        //     .subscribe(result => {

        //         season.commodity.phenology = result.data;

                season.phenology.current.stages.forEach(stage => {
                    // stage.stage = result.data.find(p => p._id === stage.stage);

                    if (moment() >= pdate.clone().add(stage.dap, 'days')) {
                        currentStage = stage;
                    } else if (nextStage == null && pdate.clone().add(stage.dap, 'days') > moment()) {
                        nextStage = stage;
                        nextStage.in = pdate.clone().add(nextStage.dap, 'days').fromNow();
                    }
                });


                season.app = season.app ? season.app : {};
                season.app.currentStage = currentStage;
                season.app.nextStage = nextStage;

                return season;
            // });

    }

    private seasonPhenology(season: any, field): any {
        season.app.phenologyModel = false;

        if (season.commodity.inf.phenologyModel != null) {
            season.app.phenologyModel = season.commodity.inf.phenologyModel;
        } else {
            season.app.phenologyModel = null;
        }

        // Loading season status
        if (season.app.phenologyModel) {

            season.modelHarvestingDate = season.phenology.current.harvestingDate;

            if (season.phenology.status.code != null) {
                season.app.seasonStatus = season.phenology.status.code;
            } else {
                season.app.seasonStatus = null;
            }

            if ((season.app.seasonStatus === 202) &&
                season.phenology.current.stages && season.phenology.current.stages.length > 0) {
                season.app.seasonStatus = 200;
            }
            if (season.app.phenologyModel === false) {
                season.app.seasonStatus = 200;
            }
            //console.log(season);
            //return season;
            return this.currentStage(season);

        } else {

            return season;

        }

    }

    private prevSeason(seasons: any, field): any {

        const sFiltered = seasons
            .filter(season => {
                const dCur = (season.phenology != null) ? season.phenology.current.harvestingDate : season.harvestingDate;
                return moment(dCur as Date).isBefore(moment());
            });

        if (sFiltered.length > 0) {
            const prevSeason = sFiltered.reduce((reg, season) => {
                const dReg = (reg.phenology != null) ? reg.phenology.current.harvestingDate : reg.harvestingDate;
                const dCur = (season.phenology != null) ? season.phenology.current.harvestingDate : season.harvestingDate;

                return ((moment(dCur as Date).isAfter(moment(dReg as Date))) ? season : reg);

            }, sFiltered[0]);

            prevSeason.app = prevSeason.app ? prevSeason.app : {};

            return this.seasonPhenology(prevSeason, field);

        } else {
            return null;
        }
    }

    private currentSeason(seasons: any, field): any {

        const sFiltered = seasons
            .filter(season => {
                const pCur = (season.phenology != null) ? season.phenology.current.plantingDate : season.plantingDate;
                const hCur = (season.phenology != null) ? season.phenology.current.harvestingDate : season.harvestingDate;
                return moment(pCur as Date).isBefore(moment()) && moment(hCur as Date).isAfter(moment());
            });

        if (sFiltered.length > 0) {

            const currentSeason = sFiltered.reduce((reg, season) => {
                const dReg = (reg.phenology != null) ? reg.phenology.current.plantingDate : reg.plantingDate;
                const dCur = (season.phenology != null) ? season.phenology.current.plantingDate : season.plantingDate;

                return ((moment(dCur as Date).isAfter(moment(dReg as Date))) ? season : reg);

            }, sFiltered[0]);

            currentSeason.app = currentSeason.app ? currentSeason.app : {};

            return this.seasonPhenology(currentSeason, field);

        } else {
            return null;
        }
    }

    private nextSeason(seasons: any, field): any {

        const sFiltered = seasons
            .filter(season => {
                const dCur = (season.phenology != null) ? season.phenology.current.plantingDate : season.plantingDate;
                return moment(dCur as Date).isAfter(moment());
            });

        if (sFiltered.length > 0) {
            const nextSeason = sFiltered.reduce((reg, season) => {
                const dReg = (reg.phenology != null) ? reg.phenology.current.plantingDate : reg.plantingDate;
                const dCur = (season.phenology != null) ? season.phenology.current.plantingDate : season.plantingDate;

                return ((moment(dCur as Date).isBefore(moment(dReg as Date))) ? season : reg);

            }, sFiltered[0]);

            nextSeason.app = nextSeason.app ? nextSeason.app : {};

            return this.seasonPhenology(nextSeason, field);

        } else {
            return null;
        }
    }

    private fieldsLoaded(fields: Array<Field>): void {

        this.allFields = fields;

        //console.log(this.allFields);

        this.allFields.forEach(field => {

            if (field.farm === null) {
                field.farm = { _id: null };
            }

            field.app = {
                season: {
                    prev: this.prevSeason(field.seasons, field),
                    current: this.currentSeason(field.seasons, field),
                    next: this.nextSeason(field.seasons, field)
                },
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

            field.app.season.display =
                field.app.season.current ? 'current' :
                    field.app.season.next ? 'next' :
                        field.app.season.prev ? 'prev' : null;

            this.loadFilters(field);

        });

        this.filterFields();

        this.fieldsLoading = false;
        this.ngxgLoadingService.setLoading(this.fieldsLoading);

    }



    /**
     * Filters
     */

    private loadFilters(field): void {

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
    }

    private filterFields(): void {

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
