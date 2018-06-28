import { Component, OnInit } from '@angular/core';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';

@Component({
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.scss']
})
export class WeatherComponent extends NgxgUnsubscribe implements OnInit {

    constructor() {
        super();
    }

    ngOnInit() {
    }

}
