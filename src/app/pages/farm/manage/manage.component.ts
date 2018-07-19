import { Component, OnInit } from '@angular/core';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';

@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

    public dataLoading: Boolean;

    constructor(private ngxgLoadingService: NgxgLoadingService) {
        this.dataLoading = true;
    }

    ngOnInit() {

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

}
