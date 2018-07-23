import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { takeUntil, startWith } from 'rxjs/operators';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { AuthService } from 'src/app/shared/services/cds/auth.service';


@Component({
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent extends NgxgRequest implements OnInit {

    public loading: Boolean;

    constructor(
        private auth: AuthService,
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

    public signout(): void {
        if (this.auth.signout()) {
            this.router.navigate(['/auth']);
        }
    }

}
