import { Component, OnInit } from '@angular/core';

import { CookieService } from 'ngx-cookie';
import * as L from 'leaflet';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public iniciou = 20;

    constructor(private cookieService: CookieService) {

        this.cookieService.put('test', 'test2', { domain: 'tttcerbaro.com', secure: true, httpOnly: true });
        console.log(1, this.cookieService.get('test'));
        this.iniciou += 20;
    }

    public ngOnInit() {

    }

}
