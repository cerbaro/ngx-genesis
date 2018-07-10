import { Component, OnInit, Inject } from '@angular/core';

import { Field } from 'src/app/shared/types/field';

import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { MapBoxService } from 'src/app/shared/services/map-box.service';
import { DataExchangeService } from 'src/app/shared/services/data-exchange.service';
import { TabLoadingService } from '../services/tab-loading.service';
import { startWith, takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './field.component.html',
    styleUrls: ['./field.component.scss']
})
export class FieldComponent extends NgxgUnsubscribe implements OnInit {

    public fieldLoading: Boolean;
    public field: Field;

    public tabsLoading: Boolean;

    constructor(
        private ngxgLoadingService: NgxgLoadingService,
        private tabLoadingService: TabLoadingService,
        private mapBoxService: MapBoxService,
        private dataExchangeService: DataExchangeService
    ) {
        super();

        this.fieldLoading = true;
        this.ngxgLoadingService.setLoading(this.fieldLoading);

        this.field = {
            name: 'Jabotirama 1',
            act: true,
            admin: true,
            area: { shape: { type: 'geometry', coordinates: [1, 2, 3] }, size: 1000 },
            elev: 0,
            farm: '',
            weatherStations: [],
            inclination: 0,
            location: { geoid: 'BRRSPFB', lat: -52, lon: -28 },
            pvt: true,
            users: [{ admin: true, user: 'Vinicius' }],
            app: {
                season: '1',
                thumbnail: this.mapBoxService.getTileImageURL([-28, -52])
            }
        };

    }

    ngOnInit() {

        // this.tabLoadingService.getLoading().pipe(
        //     startWith(true),
        //     takeUntil(this.ngxgUnsubscribe)
        // ).subscribe(
        //     loading => this.tabsLoading = loading
        // );

        setTimeout(() => {

            this.dataExchangeService.setField(this.field);
            this.fieldLoading = false;
            this.ngxgLoadingService.setLoading(this.fieldLoading);

        }, 2000);

    }

}
