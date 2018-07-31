import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';
import { SocialService } from 'src/app/shared/services/cds/social.service';
import { User } from 'src/app/shared/types/user';


@Injectable()
export class UsersResolveService implements Resolve<any> {

    private token: any = this.jwtHelper.decodeToken(this.jwtHelper.tokenGetter());

    constructor(
        private socialService: SocialService,
        private location: Location,
        private jwtHelper: JwtHelperService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {


        return this.socialService.getUsers()
            .pipe(
                map(result => {
                    const users: User[] = result.data;

                    if (users) {
                        return users;
                    } else {
                        this.previousPage();
                    }

                }),
                catchError(error => this.previousPage())
            );

    }

    private previousPage(): Observable<any> {
        this.location.back();
        return empty();
    }
}
