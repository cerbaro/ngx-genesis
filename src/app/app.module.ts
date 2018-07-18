import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxgErrHandler } from './core/err/ngxg-err-handler';
// import { AuthService } from 'src/app/shared/services/cds/auth.service';
// import { InterceptorService } from 'src/app/shared/services/auth/interceptor.service';



@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [
        { provide: ErrorHandler, useClass: NgxgErrHandler },
        // AuthService,
        // { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
