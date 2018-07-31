import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as GLOBAL from '../../globals';


@Injectable()
export class SocialService {

    private cdsBaseURL: String = GLOBAL.cdsBaseURL + '/social';

    constructor(private http: HttpClient) { }

    public getPublicInfo(userID: string): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/user/' + userID);

    }

    public getUsers(): Observable<any> {
        return this.http
            .get(this.cdsBaseURL + '/users');
    }

}
