import { Component, OnInit } from '@angular/core';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';

@Component({
    templateUrl: './phenology.component.html',
    styleUrls: ['./phenology.component.scss']
})
export class PhenologyComponent extends NgxgUnsubscribe implements OnInit {

    constructor() {
        super();
    }

    ngOnInit() {
    }

}
