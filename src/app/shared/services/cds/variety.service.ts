import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as GLOBAL from '../../globals';
import { catchError } from 'rxjs/operators';

@Injectable()
export class VarietyService {

    private cdsBaseURL = GLOBAL.cdsBaseURL;

    constructor(private http: HttpClient) { }

    public createVariety(newVariety: Object): Observable<any> {

        return this.http
            .post(this.cdsBaseURL + '/plant/variety', newVariety)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public updateVariety(id: String, variety: Object): Observable<any> {

        return this.http
            .put(this.cdsBaseURL + '/plant/variety/' + id, variety)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getVariety(id: String): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/plant/variety/' + id)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getVarieties(): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/plant/varieties/')
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getVarietiesByCommodity(commodityID: string): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/plant/varieties/commodity/' + commodityID)
            .pipe(catchError(error => Observable.throw(error)));
    }

}
