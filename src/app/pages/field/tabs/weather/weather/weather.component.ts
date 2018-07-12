import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';
import { DataExchangeService } from 'src/app/shared/services/data-exchange.service';
import { takeUntil, delay } from 'rxjs/operators';
import { Field } from 'src/app/shared/types/field';
import { TabLoadingService } from 'src/app/pages/field/services/tab-loading.service';

@Component({
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.scss']
})
export class WeatherComponent extends NgxgUnsubscribe implements OnInit {

    public field: Field;
    public tabLoading: Boolean;

    constructor(
        private tabLoadingService: TabLoadingService,
        private dataExchangeService: DataExchangeService
    ) {
        super();

        this.tabLoading = true;
    }

    ngOnInit() {

        /**
         * Timeout to avoid Error
         * ExpressionChangedAfterItHasBeenCheckedError
         */

        // setTimeout(() => {
        //     this.tabLoading = true;
        //     this.tabLoadingService.setLoading(this.tabLoading);
        // });


        this.dataExchangeService.getField().pipe(
            delay(1000),
            takeUntil(this.ngxgUnsubscribe)
        ).subscribe(
            field => {
                this.field = field;

                this.tabLoading = false;
                this.tabLoadingService.setLoading(false);
            }
        );

    }

}
