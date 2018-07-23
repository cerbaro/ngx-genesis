import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as GLOBAL from '../../globals';


@Injectable()
export class SocialService {

    private cdsBaseURL: String = GLOBAL.cdsBaseURL + '/social/user';

    constructor(private http: HttpClient) { }

    public publicInfo(userID: string): Observable<any> {

        return this.http
            .post(this.cdsBaseURL + '/', userID);


    }

}
