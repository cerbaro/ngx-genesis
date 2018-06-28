import { Component, OnInit } from '@angular/core';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';

@Component({
    templateUrl: './field.component.html',
    styleUrls: ['./field.component.scss']
})
export class FieldComponent extends NgxgUnsubscribe implements OnInit {

    constructor() {
        super();
    }

    ngOnInit() {
    }

}
