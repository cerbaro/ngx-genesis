import { Component, OnInit } from '@angular/core';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';

@Component({
    templateUrl: './satellite.component.html',
    styleUrls: ['./satellite.component.scss']
})
export class SatelliteComponent extends NgxgUnsubscribe implements OnInit {

    constructor() {
        super();
    }

    ngOnInit() {
    }

}
