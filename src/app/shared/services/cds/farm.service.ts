import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as GLOBAL from '../../globals';


@Injectable()
export class FarmService {

    private cdsBaseURL: String = GLOBAL.cdsBaseURL;

    constructor(private http: HttpClient) { }

    public createFarm(newFarm: Object): Observable<any> {

        return this.http
            .post(this.cdsBaseURL + '/landunit/farm', newFarm)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public updateFarm(id: String, farm: Object): Observable<any> {

        return this.http
            .put(this.cdsBaseURL + '/landunit/farm/' + id, farm)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getFarm(id: Object): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/landunit/farm/' + id)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getFarms(): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/landunit/farms')
            .pipe(catchError(error => Observable.throw(error)));
    }

    public deleteFarm(id: String): Observable<any> {

        return this.http
            .delete(this.cdsBaseURL + '/landunit/farm/' + id)
            .pipe(catchError(error => Observable.throw(error)));
    }

}
