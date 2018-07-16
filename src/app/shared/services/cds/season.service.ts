import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as GLOBAL from '../../globals';

@Injectable()
export class SeasonService {

    private cdsBaseURL = GLOBAL.cdsBaseURL;

    constructor(private http: HttpClient) { }

    public creatSeason(newSeason: Object): Observable<any> {

        return this.http
            .post(this.cdsBaseURL + '/season/season', newSeason)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public updateSeason(id: String, season: Object): Observable<any> {

        return this.http
            .put(this.cdsBaseURL + '/season/season/' + id, season)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public deleteSeason(id: String): Observable<any> {

        return this.http
            .delete(this.cdsBaseURL + '/season/season/' + id)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getSeason(seasonID: String): Observable<any> {
        return this.http
            .get(this.cdsBaseURL + '/season/season/' + seasonID)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getSeasons(fieldID: String): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/season/seasons/field/' + fieldID)
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getUserSeasons(): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/season/seasons/user')
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getSeasonEvents(seasonID: String): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/season/season/' + seasonID + '/events')
            .pipe(catchError(error => Observable.throw(error)));
    }

    public getSeasonPhenology(seasonID: String): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/seasonphenology/seasonphenology/season/' + seasonID)
            .pipe(catchError(error => Observable.throw(error)));
    }

}
