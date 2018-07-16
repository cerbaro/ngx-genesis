import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RecoverComponent } from './recover/recover.component';
import { LayoutComponentsModule } from '../../shared/modules/layout-components.module';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,

        LayoutComponentsModule
    ],
    declarations: [
        LoginComponent,
        SignupComponent,
        RecoverComponent
    ]
})
export class AuthModule { }
