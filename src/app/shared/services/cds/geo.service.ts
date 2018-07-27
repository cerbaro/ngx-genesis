import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as GLOBAL from '../../globals';

@Injectable()
export class GeoService {

    private cdsBaseURL = GLOBAL.cdsBaseURL + '/geo/location';

    constructor(private http: HttpClient) { }

    public getGeoID(location): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/latlon/' + location.lat + ',' + location.lon)
            .pipe(catchError(error => throwError(error)));
    }

}
