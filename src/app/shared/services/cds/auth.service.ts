import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as GLOBAL from '../../globals';


@Injectable()
export class AuthService {

    private cdsBaseURL: String = GLOBAL.cdsBaseURL + '/social/user';

    constructor(private http: HttpClient) { }

    /*
     * Account registration and activation
     */

    public signup(newAccount: Object): Observable<any> {

        return this.http
            .post(this.cdsBaseURL + '/register', newAccount);


    }

    public activateAccount(activationInfo: Object): Observable<any> {

        return this.http
            .post(this.cdsBaseURL + '/activate', activationInfo);

    }

    /*
     * Password recovery
     */

    public recoverPassword(credentials: Object): Observable<any> {

        return this.http
            .post(this.cdsBaseURL + '/password/recover', credentials);


    }

    public validateResetToken(email: String, token: String): Observable<any> {

        return this.http
            .get(this.cdsBaseURL + '/password/reset/validate/email/' + email + '/token/' + token);


    }

    public resetPassword(credentials: Object): Observable<any> {

        return this.http
            .post(this.cdsBaseURL + '/password/reset', credentials);


    }


    /*
     * Sign IN and OUT
     */

    public signin(credentials: Object): Observable<any> {

        return this.http
            .post(this.cdsBaseURL + '/authenticate', credentials);

    }

    public signout(): Boolean {

        localStorage.removeItem('SMAAccessToken');
        sessionStorage.removeItem('SMAAccessToken');

        return true;
    }

    public isSignedin(): Boolean {
        if (localStorage.getItem('SMAAccessToken') === null && sessionStorage.getItem('SMAAccessToken') === null) {
            return false;
        } else {
            return true;
        }
    }

}
