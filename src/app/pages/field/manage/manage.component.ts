import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';

@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

    public dataLoading: Boolean;
    public formField: FormGroup;

    constructor(private ngxgLoadingService: NgxgLoadingService) {
        this.dataLoading = true;
    }

    ngOnInit() {

        this.formField = new FormGroup({
            name: new FormControl(null, Validators.required),
            location: new FormGroup({
                lat: new FormControl(null, Validators.required),
                lon: new FormControl(null, Validators.required),
                geoid: new FormControl(null)
            }),
            area: new FormGroup({
                size: new FormControl(null, Validators.required),
                shape: new FormGroup({
                    type: new FormControl(null, Validators.required),
                    coordinates: new FormControl(null, Validators.required),
                })
            }, Validators.required),
            elev: new FormControl(null),
            inclination: new FormControl(null)
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
        if (this.formField.valid) {

            const fValues = this.formField.value;

        }
    }

}

