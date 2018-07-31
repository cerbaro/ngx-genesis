import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';
import { FarmService } from 'src/app/shared/services/cds/farm.service';
import { Farm } from '../../../shared/types/farm';


@Injectable()
export class FarmsResolveService implements Resolve<any> {

    private token: any = this.jwtHelper.decodeToken(this.jwtHelper.tokenGetter());

    constructor(
        private farmService: FarmService,
        private location: Location,
        private jwtHelper: JwtHelperService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {


        return this.farmService.getFarms()
            .pipe(
                map(result => {
                    const farms: Farm[] = result.data;

                    if (farms) {
                        return farms;
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
