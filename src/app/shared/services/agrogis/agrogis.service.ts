import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import * as GLOBAL from '../../globals';

@Injectable()
export class AgroGISService {

    private spatialBaseURL = GLOBAL.spatialBaseURL;

    constructor(private http: HttpClient, private datePipe: DatePipe) { }

    public summary(latitude: Number, longitude: Number, variable: String,
        band: Number, source: String, sdate: Date, edate: Date): Observable<any> {

        const sdatef = this.datePipe.transform(sdate, 'yyyyMMdd');
        const edatef = edate != null ? this.datePipe.transform(edate, 'yyyyMMdd') : this.datePipe.transform(new Date(), 'yyyyMMdd');

        return this.http
            .get(this.spatialBaseURL +
                '/spatial/raster/observed/summary/pixel/' + latitude + ',' + longitude + '/from/' +
                sdatef + '/to/' + edatef + '/variable/' + variable + '/band/' + band + '/source/' + source)
            .pipe(catchError(error => throwError(error)));
    }

    public higherThan(value: Number, latitude: Number, longitude: Number,
        variable: String, band: Number, source: String, sdate: Date, edate: Date): Observable<any> {

        const sdatef = this.datePipe.transform(sdate, 'yyyyMMdd');
        const edatef = edate != null ? this.datePipe.transform(edate, 'yyyyMMdd') : this.datePipe.transform(new Date(), 'yyyyMMdd');

        return this.http
            .get(this.spatialBaseURL +
                '/spatial/raster/observed/summary/higher/' + value + '/pixel/' + latitude +
                ',' + longitude + '/from/' + sdatef + '/to/' + edatef + '/variable/' +
                variable + '/band/' + band + '/source/' + source)
            .pipe(catchError(error => throwError(error)));
    }

    public getGeoJSON(pot: String, geoid: String, from: String,
        to: String, variable: String, version: String, source: String): Observable<any> {

        return this.http
            .get(this.spatialBaseURL + '/spatial/raster/' + pot + '/geoid/' + geoid +
                '/from/' + from + '/to/' + to + '/variable/' + variable + '/version/' + version + '/source/' + source)
            .pipe(catchError(error => throwError(error)));
    }

    public getGeoJSONColor(variable: String): Observable<any> {

        return this.http
            .get(this.spatialBaseURL + '/spatial/map/legend/variable/' + variable)
            .pipe(catchError(error => throwError(error)));
    }

    public getDailyValue(pot: String, location: any, from: String, to: String,
        variable: String, version: String, band: Number, source: String): Observable<any> {

        return this.http
            .get(this.spatialBaseURL + '/spatial/raster/' + pot + '/pixel/' +
                location.lat + ',' + location.lon + '/from/' + from + '/to/' +
                to + '/variable/' + variable + '/version/' + version + '/band/' + band + '/source/' + source)
            .pipe(catchError(error => throwError(error)));
    }

    public getClimatology(location: any, variable: String, version: String, band: Number, source: String): Observable<any> {

        return this.http
            .get(this.spatialBaseURL +
                '/spatial/raster/historical/summary/pixel/' + location.lat + ',' + location.lon +
                '/from/20000101/to/20001231/variable/' + variable + '/version/' + version +
                '/band/' + band + '/source/' + source)
            .pipe(catchError(error => throwError(error)));
    }

}
