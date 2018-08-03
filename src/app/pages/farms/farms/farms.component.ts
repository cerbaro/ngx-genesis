import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { Location } from '@angular/common';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { FarmService } from 'src/app/shared/services/cds/farm.service';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { DialogComponent } from 'src/app/shared/modules/dialog/dialog/dialog.component';

export interface FarmsTable {

    _id: string;
    name: string;

}

@Component({
    templateUrl: './farms.component.html',
    styleUrls: ['./farms.component.scss']
})
export class FarmsComponent extends NgxgRequest implements OnInit {

    public dataLoading: Boolean = true;

    public farmDataSource: MatTableDataSource<FarmsTable> = new MatTableDataSource();
    public farmTableColumns: Array<String> = ['name', 'edit', 'delete'];
    @ViewChild('farmsSort') farmsSort: MatSort;

    constructor(
        private ngxgLoadingService: NgxgLoadingService,
        private location: Location,
        private farmService: FarmService,
        private dialog: MatDialog
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

        this.loadFarms();
    }

    private loadFarms(): void {
        this.farmService.getFarms()
            .pipe(takeUntil(this.ngxgUnsubscribe))
            .subscribe(result => {
                if (result.data.length > 0) {
                    this.farmsLoaded(result.data);
                }

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

    public cancel(event: any): void {
        this.location.back();
    }

    /**
     * Delete Field
     */
    public deleteDialog(farmID): void {

        const dialogRef = this.dialog.open(DialogComponent, {
            width: '350px',
            data: {
                title: 'Apagar fazenda',
                content: 'Tem certeza que deseja apagar esta fazenda? Esta operação é irreversível',
                actions: [
                    { text: 'Cancelar', value: false },
                    { text: 'Apagar', value: true }
                ]
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.farmService.deleteFarm(farmID)
                    .subscribe(() => this.loadFarms());
            }

        });
    }

}

