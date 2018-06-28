import { Component, OnInit } from '@angular/core';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';

@Component({
    templateUrl: './climate.component.html',
    styleUrls: ['./climate.component.scss']
})
export class ClimateComponent extends NgxgUnsubscribe implements OnInit {

    constructor() {
        super();
    }

    ngOnInit() {
    }

}
