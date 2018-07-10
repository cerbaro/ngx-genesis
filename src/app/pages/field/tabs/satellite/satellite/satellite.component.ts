import { Component, OnInit } from '@angular/core';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';
import { DataExchangeService } from 'src/app/shared/services/data-exchange.service';
import { takeUntil } from 'rxjs/operators';
import { Field } from 'src/app/shared/types/field';

@Component({
    templateUrl: './satellite.component.html',
    styleUrls: ['./satellite.component.scss']
})
export class SatelliteComponent extends NgxgUnsubscribe implements OnInit {

    public field: Field;

    constructor(private dataExchangeService: DataExchangeService) {
        super();
    }

    ngOnInit() {

        this.dataExchangeService.getField().pipe(
            takeUntil(this.ngxgUnsubscribe)
        ).subscribe(
            field => {
                this.field = field;
            }
        );

    }

}
