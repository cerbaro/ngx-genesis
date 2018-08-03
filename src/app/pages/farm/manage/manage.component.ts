import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { Location } from '@angular/common';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { FarmService } from 'src/app/shared/services/cds/farm.service';
import { Farm } from 'src/app/shared/types/farm';
import { MatTableDataSource, MatSort } from '@angular/material';
import { takeUntil } from 'rxjs/operators';

export interface FarmsTable {

    _id: string;
    name: string;

}

@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent extends NgxgRequest implements OnInit {

    public dataLoading: Boolean = true;
    public formFarm: FormGroup;

    public farmDataSource: MatTableDataSource<FarmsTable> = new MatTableDataSource();
    public farmTableColumns: Array<String> = ['name', 'edit', 'delete'];
    @ViewChild('farmsSort') farmsSort: MatSort;

    constructor(
        private ngxgLoadingService: NgxgLoadingService,
        private location: Location,
        private farmService: FarmService
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

        this.formFarm = new FormGroup({
            name: new FormControl('')
        });


        this.farmService.getFarms()
            .pipe(takeUntil(this.ngxgUnsubscribe))
            .subscribe(result => {
                if (result.data.length > 0) {
                    this.farmsLoaded(result.data);
                }
            });

        setTimeout(() => {

            this.dataLoading = false;
            this.ngxgLoadingService.setLoading(this.dataLoading);

        });
    }

    private farmsLoaded(farms: Array<any>): void {

        const farmData = [];

        farms.map(farm => {
            farmData.push({ _id: farm._id, name: farm.name });
        });

        this.farmDataSource.data = farmData;
        this.farmDataSource.sort = this.farmsSort;
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

