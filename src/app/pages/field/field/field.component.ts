import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';

import * as L from 'leaflet';
import * as moment from 'moment';

import { Field } from 'src/app/shared/types/field';

import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { DataExchangeService } from 'src/app/shared/services/data-exchange.service';
import { TabLoadingService } from '../utils/tab-loading.service';
import { startWith, takeUntil, filter, map } from 'rxjs/operators';
import { LeafletService } from 'src/app/shared/modules/map/services/leaflet.service';
import { CommodityService } from 'src/app/shared/services/cds/commodity.service';
import { DarkskyService } from 'src/app/shared/services/cds/darksky.service';
import { FieldService } from 'src/app/shared/services/cds/field.service';
import { AgroGISService } from 'src/app/shared/services/agrogis/agrogis.service';



@Component({
    templateUrl: './field.component.html',
    styleUrls: ['./field.component.scss']
})
export class FieldComponent extends NgxgRequest implements OnInit {

    public field: Field;

    public fieldLoading: Boolean = true;
    public tabsLoading: Boolean = true;
    public climateDataLoading: Boolean = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private ngxgLoadingService: NgxgLoadingService,
        private tabLoadingService: TabLoadingService,
        private dataExchangeService: DataExchangeService,
        private leafLetService: LeafletService,
        private fieldService: FieldService,
        private commodityService: CommodityService,
        private darkSkyService: DarkskyService,
        private agrogisService: AgroGISService
    ) {
        super();

    }

    ngOnInit() {

        this.route.params
            .subscribe((params: Params) => {
                this.loadField(params, 0);
            });


        /**
         * Monitor tabs loading
         */

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationStart),
                takeUntil(this.ngxgUnsubscribe)
            )
            .subscribe(event => {
                if (event instanceof NavigationStart) {
                    this.tabsLoading = true;
                    this.tabLoadingService.setLoading(this.tabsLoading);
                }
            });

        this.tabLoadingService.getLoading().pipe(
            startWith(true),
            takeUntil(this.ngxgUnsubscribe)
        ).subscribe(
            loading => this.tabsLoading = loading
        );


        /**
         * Timeout to avoid Error
         * ExpressionChangedAfterItHasBeenCheckedError
         */

        setTimeout(() => {
            this.ngxgLoadingService.setLoading(this.fieldLoading);
        });

    }

    /**
     * Phenology
     */

    private currentStage(field: any): any {

        if (field.app.season.display != null &&
            field.app.season[field.app.season.display].app.phenologyModel &&
            field.app.season[field.app.season.display].app.seasonStatus === 200
        ) {

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

        if (season.commodity.inf.phenologyModel) {
            season.app.phenologyModel = season.commodity.inf.phenologyModel;
        } else {
            season.app.phenologyModel = null;

            // For those commodities that don't have model
            season.app.seasonStatus = 200;
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
                const dCur = (season.phenology != null && season.phenology.current.harvestingDate != null) ?
                    season.phenology.current.harvestingDate : season.harvestingDate;

                return moment(dCur as Date).isBefore(moment());
            });

        if (sFiltered.length > 0) {
            const prevSeason = sFiltered.reduce((reg, season) => {
                const dReg = (reg.phenology != null && reg.phenology.current.harvestingDate != null) ?
                    reg.phenology.current.harvestingDate : reg.harvestingDate;
                const dCur = (season.phenology != null && season.phenology.current.harvestingDate != null) ?
                    season.phenology.current.harvestingDate : season.harvestingDate;

                return ((moment(dCur as Date).isAfter(moment(dReg as Date))) ? season : reg);

            }, sFiltered[0]);

            prevSeason.app = prevSeason.app ? prevSeason.app : {};

            const endDate = moment((prevSeason.phenology != null && prevSeason.phenology.current.harvestingDate != null) ?
                prevSeason.phenology.current.harvestingDate : prevSeason.harvestingDate);

            prevSeason.app.endDate = Math.abs(moment().diff(endDate, 'days'));

            return this.seasonPhenology(prevSeason);

        } else {
            return null;
        }
    }

    private currentSeason(seasons: any): any {

        const sFiltered = seasons
            .filter(season => {
                const pCur = (season.phenology != null && season.phenology.current.plantingDate != null) ?
                    season.phenology.current.plantingDate : season.plantingDate;
                const hCur = (season.phenology != null && season.phenology.current.harvestingDate != null) ?
                    season.phenology.current.harvestingDate : season.harvestingDate;

                return moment(pCur as Date).isBefore(moment()) && moment(hCur as Date).isAfter(moment()) ||
                    (season.commodity.inf.phenologyModel &&
                        moment(pCur as Date).isBefore(moment()) && season.phenology.status.code !== 200);
            });

        if (sFiltered.length > 0) {

            const currentSeason = sFiltered.reduce((reg, season) => {
                const dReg = (reg.phenology != null && reg.phenology.current.plantingDate != null) ?
                    reg.phenology.current.plantingDate : reg.plantingDate;
                const dCur = (season.phenology != null && season.phenology.current.plantingDate != null) ?
                    season.phenology.current.plantingDate : season.plantingDate;

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
                const dCur = (season.phenology != null && season.phenology.current.plantingDate) ?
                    season.phenology.current.plantingDate : season.plantingDate;
                return moment(dCur as Date).isAfter(moment());
            });

        if (sFiltered.length > 0) {
            const nextSeason = sFiltered.reduce((reg, season) => {
                const dReg = (reg.phenology != null && reg.phenology.current.plantingDate != null) ?
                    reg.phenology.current.plantingDate : reg.plantingDate;
                const dCur = (season.phenology != null && season.phenology.current.plantingDate) ?
                    season.phenology.current.plantingDate : season.plantingDate;

                return ((moment(dCur as Date).isBefore(moment(dReg as Date))) ? season : reg);

            }, sFiltered[0]);

            nextSeason.app = nextSeason.app ? nextSeason.app : {};

            const startDate = moment((nextSeason.phenology != null && nextSeason.phenology.current.plantingDate) ?
                nextSeason.phenology.current.plantingDate : nextSeason.plantingDate);
            nextSeason.app.startDate = Math.abs(moment().diff(startDate, 'days'));

            return this.seasonPhenology(nextSeason);

        } else {
            return null;
        }
    }

    /**
     * Weather & Climate Data
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

    private climateData(field: Field): void {

        this.climateDataLoading = true;

        let sDate = moment().subtract(30, 'days').toDate();
        let eDate = moment().toDate();

        const variables = [
            { variable: 'totR', source: 'gpm', band: 1 },
            { variable: 'gdd', source: 'ensoag', band: 2 },
            { variable: 'arid', source: 'ensoag', band: 1 }
        ];
        const display = field.app.season.display;

        if (display && field.app.season[field.app.season.display].app.seasonStatus === 200 && display !== 'next') {

            sDate = field.app.season[display].plantingDate as Date;
            eDate = (field.app.season[display].app.phenologyModel) ?
                field.app.season[display].modelHarvestingDate as Date :
                field.app.season[display].harvestingDate as Date;

            if (moment(eDate).isAfter(moment())) {
                eDate = new Date();
            }
        }

        field.app.climate = field.app.climate ? field.app.climate : {};
        field.app.climate.sDate = sDate;
        field.app.climate.eDate = eDate;
        field.app.climate.diffDate = moment(eDate).diff(sDate, 'days');

        let variablesObservable = [].concat.apply([], variables.map(variable => {
            return this.agrogisService
                .summary(field.location.lat, field.location.lon,
                    variable.variable, variable.band, variable.source, sDate, eDate);
        })) as Observable<any>[];

        variablesObservable = variablesObservable.filter(x => x != null);

        if (variablesObservable.length > 0) {

            let reqDone = 0;

            variablesObservable.forEach(
                variableObservable => {
                    variableObservable
                        .pipe(takeUntil(this.ngxgUnsubscribe))
                        .subscribe(response => {

                            if (response !== null) {
                                field.app.climate = field.app.climate ? field.app.climate : {};
                                field.app.climate[response[0].variable] = response[0];
                            }

                            if (reqDone++ >= variablesObservable.length - 1) {
                                this.climateDataLoading = false;
                            }

                            // console.log(response);

                        });
                });

        } else {
            this.climateDataLoading = false;
        }


    }

    private loadField(params: any, tryingSeason: number): void {

        this.fieldService.getFieldWithSeasons(params['field'])
            .pipe(takeUntil(this.ngxgUnsubscribe))
            .subscribe(result => {

                this.field = result.data[0];
                this.fieldLoaded(this.field, params['season'], tryingSeason);

            });
    }

    private fieldLoaded(field: Field, seasonID: any, tryingSeason: number): void {

        let selectedSeason: any;

        if (field.farm === null) {
            field.farm = { _id: null };
        }

        if (seasonID != null) {
            selectedSeason = [this.field.seasons.find(season => season._id === seasonID)];
        } else {
            selectedSeason = field.seasons;
        }

        field.app = {
            hidden: true,
            season: {
                prev: this.prevSeason(selectedSeason),
                current: this.currentSeason(selectedSeason),
                next: this.nextSeason(selectedSeason)
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
        this.climateData(field);


        // Automatically reload page in case season is not ready
        if (tryingSeason < 10 &&
            field.app.season.display &&
            field.app.season[field.app.season.display].app.seasonStatus !== 200 &&
            field.app.season[field.app.season.display].app.seasonStatus < 400) {

            setTimeout(() => {

                this.route.params
                    .subscribe((params: Params) => {
                        this.loadField(params, tryingSeason + 1);
                    });

            }, 15000);

        }

        this.dataExchangeService.setField(field);
        this.fieldLoading = false;
        this.ngxgLoadingService.setLoading(this.fieldLoading);

    }

    public switchSeason(season) {
        const currentSubPage = this.route.snapshot.firstChild.url[0].path;
        const localPage = (!season.commodity.phenologyModel && currentSubPage === 'phenology') ? 'weather' : currentSubPage;

        this.router.navigate(['/field', this.field._id, 'season', season._id, localPage]);
    }

}
