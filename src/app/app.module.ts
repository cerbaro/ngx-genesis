import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxgErrHandler } from './core/err/ngxg-err-handler';
import { JwtModule } from '@auth0/angular-jwt';
// import { AuthService } from 'src/app/shared/services/cds/auth.service';
// import { InterceptorService } from 'src/app/shared/services/auth/interceptor.service';


function getLocalStorageItem() {
    return localStorage.getItem('SMAAccessToken') || sessionStorage.getItem('SMAAccessToken');
}


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,

        JwtModule.forRoot({
            config: {
                tokenGetter: getLocalStorageItem,
                whitelistedDomains: ['cloud.smartcampo.com']
            }
        }),
    ],
    providers: [
        { provide: ErrorHandler, useClass: NgxgErrHandler }
        // AuthService,
        // { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
