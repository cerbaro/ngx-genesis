import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { Location } from '@angular/common';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { FarmService } from 'src/app/shared/services/cds/farm.service';
import { Farm } from 'src/app/shared/types/farm';

@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent extends NgxgRequest implements OnInit {

    public dataLoading: Boolean = true;
    public formFarm: FormGroup;

    constructor(
        private ngxgLoadingService: NgxgLoadingService,
        private location: Location,
        private farmService: FarmService
    ) {
        super();

    }

    ngOnInit() {

        this.formFarm = new FormGroup({
            name: new FormControl('')
        });

        /**
         * Timeout to avoid Error
         * ExpressionChangedAfterItHasBeenCheckedError
         */

        setTimeout(() => {
            this.ngxgLoadingService.setLoading(this.dataLoading);
        });

        setTimeout(() => {

            this.dataLoading = false;
            this.ngxgLoadingService.setLoading(this.dataLoading);

        });
    }

    public submit(): void {

        if (this.formFarm.valid) {

            const fValues = this.formFarm.value;
            const farm = fValues as Farm;

            this.farmService.createFarm({ farm: farm }).subscribe(
                result => {
                    this.cancel(null);
                },
                error => this.setError(error)
            );
        }
    }

    public cancel(event: any): void {
        this.location.back();
    }
}

