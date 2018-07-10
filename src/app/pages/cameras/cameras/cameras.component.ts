import { Component, OnInit } from '@angular/core';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';

@Component({
    templateUrl: './cameras.component.html',
    styleUrls: ['./cameras.component.scss']
})
export class CamerasComponent extends NgxgUnsubscribe implements OnInit {

    public camerasLoading: Boolean;

    constructor(private ngxgLoadingService: NgxgLoadingService) {
        super();

        this.camerasLoading = true;
    }

    ngOnInit() {

        /**
         * Timeout to avoid Error
         * ExpressionChangedAfterItHasBeenCheckedError
         */

        setTimeout(() => {
            this.ngxgLoadingService.setLoading(this.camerasLoading);
        });

        setTimeout(() => {
            this.camerasLoading = false;
            this.ngxgLoadingService.setLoading(this.camerasLoading);
        }, 0);

    }
}
