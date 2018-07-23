import { Component, OnInit } from '@angular/core';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { DataExchangeService } from 'src/app/shared/services/data-exchange.service';
import { takeUntil, delay } from 'rxjs/operators';
import { Field } from 'src/app/shared/types/field';
import { TabLoadingService } from 'src/app/pages/field/utils/tab-loading.service';

@Component({
    templateUrl: './satellite.component.html',
    styleUrls: ['./satellite.component.scss']
})
export class SatelliteComponent extends NgxgRequest implements OnInit {

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
