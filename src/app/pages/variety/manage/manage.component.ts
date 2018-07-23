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
    public formVariety: FormGroup;

    constructor(private ngxgLoadingService: NgxgLoadingService, private location: Location) {
        this.dataLoading = true;
    }

    ngOnInit() {

        this.formVariety = new FormGroup({
            name: new FormControl(''),
            comercialName: new FormControl([], Validators.required),
            type: new FormControl([], Validators.required),
            user: new FormControl([], Validators.required),
            commodity: new FormControl([], Validators.required),
            maturity: new FormGroup({
                mg: new FormControl('', Validators.required),
                crm: new FormControl(''),
                lc: new FormControl('5', Validators.required)
            })
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
        if (this.formVariety.valid) {

            const fValues = this.formVariety.value;

        }
    }

    public cancel(event: any): void {
        this.location.back();
    }
}

