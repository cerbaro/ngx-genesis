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
            email: new FormControl('', Validators.email),
            passwd: new FormControl('', [Validators.required, Validators.minLength(8)]),
            remember: new FormControl(false)
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

        }, 2000);
    }

    public submit(): void {
        if (this.formField.valid) {

            const fValues = this.formField.value;

        }
    }

}

