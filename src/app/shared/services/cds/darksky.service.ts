import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as GLOBAL from '../../globals';

@Injectable()
export class DarkskyService {

    private cdsBaseURL: String = GLOBAL.cdsBaseURL + '/darksky/field';

    constructor(private http: HttpClient) {

    }

    public getDarkSkyCDS(id: String, location: any): Observable<any> {
        return this.http
            .get(this.cdsBaseURL + '/' + id + '/lat/' + location.lat + '/lon/' + location.lon)
            .pipe(catchError(error => Observable.throw(error)));
    }

}
