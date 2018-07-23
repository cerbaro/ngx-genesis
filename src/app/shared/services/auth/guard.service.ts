import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthGuardService implements CanActivate {

    private token: string;
    private redirectUrl: string;

    constructor(public router: Router, private jwtHelper: JwtHelperService) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        this.redirectUrl = state.url;
        this.token = this.jwtHelper.tokenGetter();

        if (this.token === null || this.jwtHelper.isTokenExpired(this.token)) {
            this.router.navigate(['auth'], { queryParams: { returnto: this.redirectUrl } });
            return false;
        }

        return true;

    }

}
