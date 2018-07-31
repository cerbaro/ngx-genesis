import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';
import { VarietyService } from 'src/app/shared/services/cds/variety.service';



@Injectable()
export class VarietiesResolveService implements Resolve<any> {

    private token: any = this.jwtHelper.decodeToken(this.jwtHelper.tokenGetter());

    constructor(
        private varietyService: VarietyService,
        private location: Location,
        private jwtHelper: JwtHelperService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {


        return this.varietyService.getVarieties()
            .pipe(
                map(result => {
                    const varieties: any[] = result.data;

                    if (varieties) {
                        return varieties;
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
