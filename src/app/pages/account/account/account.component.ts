import { Component, OnInit } from '@angular/core';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';

@Component({
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent extends NgxgUnsubscribe implements OnInit {

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

