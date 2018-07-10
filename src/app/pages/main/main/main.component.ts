import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';
import { takeUntil, startWith } from 'rxjs/operators';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';


@Component({
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent extends NgxgUnsubscribe implements OnInit {

    public loading: Boolean;

    constructor(
        private router: Router,
        private ngxgLoadingService: NgxgLoadingService
    ) {
        super();
    }

    ngOnInit() {

        /**
         * Monitor tabs loading
         */

        this.ngxgLoadingService.getLoading().pipe(
            startWith(true),
            takeUntil(this.ngxgUnsubscribe)
        ).subscribe(
            loading => this.loading = loading
        );

    }

    public onActivate(event) {
        window.scroll(0, 0);
    }

}
