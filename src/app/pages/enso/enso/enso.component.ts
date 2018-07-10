import { Component, OnInit } from '@angular/core';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';

@Component({
    selector: 'app-enso',
    templateUrl: './enso.component.html',
    styleUrls: ['./enso.component.scss']
})
export class EnsoComponent extends NgxgUnsubscribe implements OnInit {

    public ensoLoading: Boolean;

    constructor(private ngxgLoadingService: NgxgLoadingService) {
        super();

        this.ensoLoading = true;
    }

    ngOnInit() {

        /**
         * Timeout to avoid Error
         * ExpressionChangedAfterItHasBeenCheckedError
         */

        setTimeout(() => {
            this.ngxgLoadingService.setLoading(this.ensoLoading);
        });

        setTimeout(() => {
            this.ensoLoading = false;
            this.ngxgLoadingService.setLoading(this.ensoLoading);
        }, 0);

    }

}
