import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as GLOBAL from '../../globals';

@Injectable()
export class FieldService {

    private cdsBaseURL = GLOBAL.cdsBaseURL;
    private spatialBaseURL = GLOBAL.spatialBaseURL;

    constructor(private http: HttpClient) { }

    public createField(newField: Object): Observable<any> {

        return this.http
            .post(this.cdsBaseURL + '/landunit/field', newField)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public updateField(id: String, field: Object): Observable<any> {

        return this.http
            .put(this.cdsBaseURL + '/landunit/field/' + id, field)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getField(id: Object): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/landunit/field/' + id)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getFields(): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/landunit/fields')
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getFieldWithSeasons(id: String): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/season/fieldwithseasons2/field/' + id)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getFieldsWithSeasons(): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/season/fieldswithseasons2')
            .pipe(catchError(error => Observable.throw(error)));
    }

    public deleteField(id: String): Observable<any> {

        return this.http
            .delete(this.cdsBaseURL + '/landunit/field/' + id)
            .pipe(catchError(error => Observable.throw(error)));
    }


    /*
     * PostGIS
     */

    public createPostGIS(geom: Object): Observable<any> {
        return this.http
            .post(this.spatialBaseURL + '/spatial/shape/field', geom)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public updatePostGIS(id: String, geom: Object): Observable<any> {

        return this.http
            .put(this.spatialBaseURL + '/spatial/shape/field/' + id, geom)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getFieldGeoID(location): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/geo/location/latlon/' + location.lat + ',' + location.lon)
            .pipe(catchError(error => Observable.throw(error)));
    }

}
