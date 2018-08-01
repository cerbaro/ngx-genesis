import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, RequiredValidator } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { SeasonService } from 'src/app/shared/services/cds/season.service';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';

import * as moment from 'moment';

@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent extends NgxgRequest implements OnInit {

    private fieldID: String;
    private seasonID: String;

    public commodities: any;
    public allVarieties: any;
    public varieties: any;

    public editing: Boolean = false;

    public dataLoading: Boolean = true;
    public formSeason: FormGroup;

    constructor(
        private ngxgLoadingService: NgxgLoadingService,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private seasonService: SeasonService
    ) {
        super();
    }

    ngOnInit() {

        this.formSeason = new FormGroup({
            name: new FormControl(null),
            field: new FormControl(null, Validators.required),
            commodity: new FormControl(null, Validators.required),
            variety: new FormControl(null, Validators.required),
            plantingDate: new FormControl(null, Validators.required),
            harvestingDate: new FormControl(null),
            plantingDepth: new FormControl(5, Validators.required),
            irrigated: new FormControl(false, Validators.required)
        });

        this.route.data.subscribe(
            data => {
                this.commodities = data.commodities;
                this.allVarieties = data.varieties;

                /**
                 * Link both commodities and varieties selects
                 */

                this.formSeason.get('commodity').valueChanges.subscribe(commodity => {

                    if (this.formSeason.get('commodity').dirty) {

                        this.formSeason.get('variety').reset();
                        this.formSeason.get('harvestingDate').reset();

                        this.varieties = this.allVarieties.filter(variety => {
                            return variety.commodity._id === commodity._id;
                        });

                        this.formSeason.get('variety').enable();

                    }

                });
            });

        this.route.params
            .subscribe((params: Params) => {

                if (params['season']) {

                    this.loadSeasonData(params['season']);
                    this.editing = true;

                } else {

                    this.newSeason(params['field']);

                }

            });

        /**
         * Timeout to avoid Error
         * ExpressionChangedAfterItHasBeenCheckedError
         */

        setTimeout(() => {
            this.ngxgLoadingService.setLoading(this.dataLoading);
        });


    }

    private pageLoaded(): void {
        setTimeout(() => {
            this.dataLoading = false;
            this.ngxgLoadingService.setLoading(this.dataLoading);
        });
    }

    private newSeason(fieldID: String): void {

        this.fieldID = fieldID;
        this.formSeason.get('variety').disable();

        this.pageLoaded();

    }

    private loadSeasonData(seasonID: string): void {

        this.seasonID = seasonID;

        this.seasonService.getSeason(this.seasonID)
            .pipe(takeUntil(this.ngxgUnsubscribe))
            .subscribe(result => {

                const season = result.data;

                /**
                 * Load Form
                 */
                Object.keys(this.formSeason.value).forEach(key => {
                    if (season[key]) {
                        if (key === 'commodity') {
                            this.formSeason.get(key).setValue(this.commodities.find(commodity => commodity._id === season[key]._id));
                            this.varieties = this.allVarieties.filter(variety => {
                                return variety.commodity._id === this.formSeason.get(key).value._id;
                            });
                        } else if (key === 'variety') {
                            this.formSeason.get(key).setValue(this.allVarieties.find(variety => variety._id === season[key]._id));
                        } else {
                            this.formSeason.get(key).setValue(season[key]);
                        }
                    }
                });

                this.fieldID = season.field._id;

                this.pageLoaded();
            });
    }

    public submit(): void {

        this.formSeason.get('field').setValue(this.fieldID);

        if (this.formSeason.valid) {

            const season = this.formSeason.value;

            season.name = season.name ? season.name :
                moment(season.plantingDate).format('YYYY') + '/' +
                moment(season.plantingDate).clone().add(1, 'year').format('YYYY') + ' ' +
                season.commodity.name + ' #' + moment().format('DDMMHHmmSS');

            season.plantingDate = moment(season.plantingDate).format('YYYY-MM-DD');
            season.harvestingDate = season.harvestingDate ? moment(season.harvestingDate).format('YYYY-MM-DD') : null;

            season.commodity = season.commodity._id;
            season.variety = season.variety._id;

            if (this.editing) {

                this.seasonService.updateSeason(this.seasonID, { season: season }).subscribe(
                    result => {
                        this.router.navigate(['/field', this.fieldID, 'season', result.data['_id']]);
                    },
                    error => this.setError(error));

            } else {

                this.seasonService.creatSeason({ season: season }).subscribe(
                    result => {
                        this.router.navigate(['/field', this.fieldID, 'season', result.data['_id']]);
                    },
                    error => this.setError(error));

            }

        }

    }

    public cancel(event: any): void {
        this.location.back();
    }
}

