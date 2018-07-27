import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as GLOBAL from '../../globals';

@Injectable()
export class CommodityService {

    private cdsBaseURL = GLOBAL.cdsBaseURL;

    constructor(private http: HttpClient) { }

    public createCommodity(newCommodity: Object): Observable<any> {

        return this.http
            .post(this.cdsBaseURL + '/plant/commodity', newCommodity)
            .pipe(catchError(error => throwError(error)));
    }

    public updateCommodity(id: String, commodity: Object): Observable<any> {

        return this.http
            .put(this.cdsBaseURL + '/plant/commodity/' + id, commodity)
            .pipe(catchError(error => throwError(error)));
    }

    public getCommodity(id: String): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/plant/commodity/' + id)
            .pipe(catchError(error => throwError(error)));
    }

    public getCommodities(): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/plant/commodities/')
            .pipe(catchError(error => throwError(error)));
    }

    public getPhenologyStages(id: String): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/plant/phenologicalstages/commodity/' + id)
            .pipe(catchError(error => throwError(error)));
    }

}
