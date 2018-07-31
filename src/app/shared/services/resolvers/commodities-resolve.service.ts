import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, empty } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { JwtHelperService } from '@auth0/angular-jwt';
import { CommodityService } from 'src/app/shared/services/cds/commodity.service';



@Injectable()
export class CommoditiesResolveService implements Resolve<any> {

    private token: any = this.jwtHelper.decodeToken(this.jwtHelper.tokenGetter());

    constructor(
        private commodityService: CommodityService,
        private location: Location,
        private jwtHelper: JwtHelperService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        return this.commodityService.getCommodities()
            .pipe(
                map(result => {
                    const commodities: any[] = result.data;
                    
                    if (commodities) {
                        return commodities;
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
