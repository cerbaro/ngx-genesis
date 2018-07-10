import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgxgErrHandler } from 'src/app/core/err/ngxg-err-handler';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
    ],
    providers: [
        { provide: ErrorHandler, useClass: NgxgErrHandler }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
