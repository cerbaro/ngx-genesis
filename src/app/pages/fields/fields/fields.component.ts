import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as L from 'leaflet';
import * as moment from 'moment';

import { Field } from 'src/app/shared/types/field';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { FieldService } from 'src/app/shared/services/cds/field.service';
import { takeUntil, map } from 'rxjs/operators';
import { LeafletService } from 'src/app/shared/modules/map/services/leaflet.service';
import { CommodityService } from 'src/app/shared/services/cds/commodity.service';
import { DarkskyService } from 'src/app/shared/services/cds/darksky.service';


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
    // public fields: Array<Field> = Array();
    public fieldsToShow: Boolean;

    public fieldsMap: L.Map;

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

    private mouseooverTout: any;

    constructor(
        private router: Router,
        private ngxgLoadingService: NgxgLoadingService,
        private leafLetService: LeafletService,
        private fieldService: FieldService,
        private commodityService: CommodityService,
        private darkSkyService: DarkskyService
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


    /**
     * Phenology
     */

    private currentStage(field: any): any {

        if (field.app.season.display != null && field.app.season[field.app.season.display].app.phenologyModel) {

            const display: string = field.app.season.display;
            let currentStage: any = null;
            let nextStage: any = null;

            const pdate = moment(field.app.season[display].plantingDate as string, 'YYYY-MM-DD');

            this.commodityService
                .getPhenologyStages(field.app.season[display].commodity._id)
                .pipe(takeUntil(this.ngxgUnsubscribe))
                .subscribe(result => {

                    field.app.season[display].commodity.phenology = result.data;

                    field.app.season[display].phenology.current.stages.forEach(stage => {
                        stage.stage = result.data.find(p => p._id === stage.stage);

                        if (moment() >= pdate.clone().add(stage.dap, 'days')) {
                            currentStage = stage;
                        } else if (nextStage == null && pdate.clone().add(stage.dap, 'days') > moment()) {
                            nextStage = stage;
                            nextStage.in = pdate.clone().add(nextStage.dap, 'days').fromNow();
                        }
                    });


                    field.app.season[display].app = field.app.season[display].app ? field.app.season[display].app : {};
                    field.app.season[display].app.currentStage = currentStage;
                    field.app.season[display].app.nextStage = nextStage;

                });
        }

    }

    private seasonPhenology(season: any): any {
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

        }

        return season;

    }

    private prevSeason(seasons: any): any {

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

            return this.seasonPhenology(prevSeason);

        } else {
            return null;
        }
    }

    private currentSeason(seasons: any): any {

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

            return this.seasonPhenology(currentSeason);

        } else {
            return null;
        }
    }

    private nextSeason(seasons: any): any {

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

            return this.seasonPhenology(nextSeason);

        } else {
            return null;
        }
    }


    /**
     * Weather Data
     */

    private weatherData(field: Field): void {

        this.darkSkyService.getDarkSkyCDS(field._id, field.location)
            .pipe(
                takeUntil(this.ngxgUnsubscribe),
                map(result => result.data.darkSky)
            ).subscribe(result => {

                if (result !== null) {
                    field.app.weather = field.app.weather ? field.app.weather : {};
                    field.app.weather.temperature = Math.round(result.currently.temperature);
                    field.app.weather.summary = result.currently.summary;
                    field.app.weather.sunset = moment.unix(result.daily.data[1].sunsetTime).utc().utcOffset('-0300').format('HH:mm');
                    field.app.weather.sunrise = moment.unix(result.daily.data[1].sunriseTime).utc().utcOffset('-0300').format('HH:mm');
                    field.app.weather.lastRain = null;
                }

            });
    }

    private fieldsLoaded(fields: Array<Field>): void {

        this.allFields = fields;

        this.allFields.forEach(field => {

            if (field.farm === null) {
                field.farm = { _id: null };
            }

            field.app = {
                hidden: true,
                season: {
                    prev: this.prevSeason(field.seasons),
                    current: this.currentSeason(field.seasons),
                    next: this.nextSeason(field.seasons)
                },
                map: {
                    geojson: {
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
                    },
                    divIconOptions: {
                        className: '',
                        iconAnchor: [25, 57],
                        html: '<div class="map-field-marker">' +
                            '<img src="' + this.leafLetService
                                .getTileImageURL([field.location.lat, field.location.lon], null, 'mapbox.satellite', 16) + '">'
                            + '</div>'
                    }
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


            this.currentStage(field);
            this.weatherData(field);
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

        this.fieldsToShow = false;

        this.allFields.forEach(field => field.app.hidden = true);

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
            ).forEach(field => {
                field.app.hidden = false;
                this.fieldsToShow = true;
            });

    }

    public filterChange(fltr, selectedOptions) {

        this.filterBy[fltr] = selectedOptions.selected.map(sel => sel.value);
        this.filterFields();

    }


    /**
     * Events
     *
     * Mouse, Leaflet ...
     */

    public fieldOut(field: Field): void {
        clearTimeout(this.mouseooverTout);
    }

    public fieldHover(field: Field): void {
        // this.fieldsMap.panTo([field.location.lat, field.location.lon]);
        // this.fieldsMap.zoomIn(10);

        // Timeout to give some time to user navigate through the menu without changing the map view
        clearTimeout(this.mouseooverTout);
        this.mouseooverTout = setTimeout(() => {
            this.fieldsMap.setView([field.location.lat, field.location.lon], 12);
        }, 1000);
    }

    public mapInstance(llmap: L.Map): void {
        this.fieldsMap = llmap;
    }

    public markerClicked(event: any): void {
        const field = this.allFields.find(fld => fld._id === event.fieldId);

        this.openField(field);
    }

    public openField(field: Field): void {

        let link = '/field/' + field._id;

        if (field.app.season.display != null) {
            link = link + '/season/' + field.app.season[field.app.season.display]._id;
        }

        this.router.navigate([link]);
    }


}
