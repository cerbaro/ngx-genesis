import { Component, OnInit } from '@angular/core';

import { Field } from 'src/app/shared/types/field';

import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { MapBoxService } from 'src/app/shared/services/map-box.service';

@Component({
    templateUrl: './field.component.html',
    styleUrls: ['./field.component.scss']
})
export class FieldComponent extends NgxgUnsubscribe implements OnInit {

    public fieldLoading: Boolean;
    public field: Field;

    constructor(private ngxgLoadingService: NgxgLoadingService, private mapBoxService: MapBoxService) {
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
                thumbnail: this.mapBoxService.getTileImageURL([-28, -52])
            }
        };
    }

    ngOnInit() {

        setTimeout(() => {
            this.fieldLoading = false;
            this.ngxgLoadingService.setLoading(this.fieldLoading);
        }, 2000);

    }

}
