import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    public loadingActive: Boolean;

    constructor() {
        this.loadingActive = false;
    }

    ngOnInit() { }

    public onActivate(event) {
        window.scroll(0, 0);
    }

}
