import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AuthRoutingModule } from './auth-routing.module';

import { AuthComponent } from './auth/auth.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { RecoverComponent } from './recover/recover.component';
import { ResetComponent } from './reset/reset.component';

import { AuthService } from 'src/app/shared/services/cds/auth.service';

import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { InterceptorService } from 'src/app/shared/services/auth/interceptor.service';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        AuthRoutingModule,

        LayoutComponentsModule,

        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        LoginComponent,
        SignupComponent,
        RecoverComponent,
        AuthComponent,
        ResetComponent
    ],
    providers: [
        AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
    ]
})
export class AuthModule { }
