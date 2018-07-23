import { Component, OnInit } from '@angular/core';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';

@Component({
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent extends NgxgRequest implements OnInit {

    public accountLoading: Boolean;

    constructor(private ngxgLoadingService: NgxgLoadingService) {
        super();

        this.accountLoading = true;
    }

    ngOnInit() {

        /**
         * Timeout to avoid Error
         * ExpressionChangedAfterItHasBeenCheckedError
         */

        setTimeout(() => {
            this.ngxgLoadingService.setLoading(this.accountLoading);
        });

        setTimeout(() => {
            this.accountLoading = false;
            this.ngxgLoadingService.setLoading(this.accountLoading);
        }, 0);

    }
}

