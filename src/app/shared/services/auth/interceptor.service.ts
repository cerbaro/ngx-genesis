import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as GLOBAL from '../../globals';

@Injectable()
export class InterceptorService implements HttpInterceptor {

    private presetHeaders: any;
    private xApiKey = GLOBAL.xApiKey;

    constructor() { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.presetHeaders = {
            'x-api-key': this.xApiKey
        };

        if (localStorage.getItem('SMAAccessToken') != null) {
            this.presetHeaders.Authorization = localStorage.getItem('SMAAccessToken');
        } else if (sessionStorage.getItem('SMAAccessToken') != null) {
            this.presetHeaders.Authorization = sessionStorage.getItem('SMAAccessToken');
        }

        req = req.clone({ setHeaders: this.presetHeaders });

        return next.handle(req);
    }
}
