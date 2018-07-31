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
            name: new FormControl(''),
            field: new FormControl([], Validators.required),
            commodity: new FormControl([], Validators.required),
            variety: new FormControl([], Validators.required),
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
                        this.formSeason.get('harvestingDate').clearValidators();

                        if (!commodity.inf.phenologyModel) {
                            this.formSeason.get('harvestingDate').setValidators(Validators.required);
                        }

                        this.varieties = this.allVarieties.filter(variety => {
                            return variety.commodity._id === commodity._id;
                        });
                        this.formSeason.get('variety').setValue([]);
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
                        } else if (key === 'variety') {
                            this.formSeason.get(key).setValue(this.varieties.find(variety => variety._id === season[key]._id));
                        } else {
                            this.formSeason.get(key).setValue(season[key]);
                        }
                    }
                });

                this.pageLoaded();
            });
    }

    public submit(): void {

        /**
         * When selection commodities without phenology model it's mandatory to enter a harvesting date
         */
        this.formSeason.get('harvestingDate').updateValueAndValidity();

        this.formSeason.get('field').setValue(this.fieldID);

        if (this.formSeason.valid) {

            const season = this.formSeason.value;
            console.log(season);

        }

    }

    public cancel(event: any): void {
        this.location.back();
    }
}

