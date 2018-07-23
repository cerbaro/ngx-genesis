import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { Location } from '@angular/common';

@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

    public dataLoading: Boolean;
    public formFarm: FormGroup;

    constructor(private ngxgLoadingService: NgxgLoadingService, private location: Location) {
        this.dataLoading = true;
    }

    ngOnInit() {

        this.formFarm = new FormGroup({
            name: new FormControl(''),
            users: new FormControl([], Validators.required)
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

        }
    }

    public cancel(event: any): void {
        this.location.back();
    }
}

