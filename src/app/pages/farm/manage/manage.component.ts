import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { Location } from '@angular/common';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { FarmService } from 'src/app/shared/services/cds/farm.service';
import { takeUntil } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';

export interface FarmsTable {

    _id: string;
    name: string;

}

@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent extends NgxgRequest implements OnInit {

    private farmID: string;

    public editing: Boolean = false;

    public dataLoading: Boolean = true;
    public formFarm: FormGroup;

    constructor(
        private ngxgLoadingService: NgxgLoadingService,
        private location: Location,
        private farmService: FarmService,
        private route: ActivatedRoute
    ) {
        super();

    }

    ngOnInit() {

        /**
         * Timeout to avoid Error
         * ExpressionChangedAfterItHasBeenCheckedError
         */

        setTimeout(() => {
            this.ngxgLoadingService.setLoading(this.dataLoading);
        });

        this.route.params
            .subscribe((params: Params) => {

                if (params['farm']) {
                    this.loadFarmData(params['farm']);
                    this.editing = true;
                } else {
                    this.pageLoaded();
                }

            });

        this.formFarm = new FormGroup({
            name: new FormControl(null, Validators.required)
        });

    }

    private pageLoaded(): void {
        setTimeout(() => {
            this.dataLoading = false;
            this.ngxgLoadingService.setLoading(this.dataLoading);
        });
    }

    private loadFarmData(farmID: string): void {

        this.farmID = farmID;

        this.farmService.getFarm(this.farmID)
            .pipe(takeUntil(this.ngxgUnsubscribe))
            .subscribe(result => {

                const farm = result.data;

                Object.keys(this.formFarm.value).forEach(key => {
                    if (farm[key]) {
                        this.formFarm.get(key).setValue(farm[key]);
                    }
                });

                this.pageLoaded();
            });
    }

    public submit(): void {

        if (this.formFarm.valid) {

            const farm = this.formFarm.value;

            if (this.editing) {

                this.farmService.updateFarm(this.farmID, { farm: farm }).subscribe(
                    result => {
                        this.cancel(null);
                    },
                    error => this.setError(error));

            } else {

                this.farmService.createFarm({ farm: farm }).subscribe(
                    result => {
                        this.cancel(null);
                    },
                    error => this.setError(error));
            }
        }
    }

    public cancel(event: any): void {
        this.location.back();
    }
}

