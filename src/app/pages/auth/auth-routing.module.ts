import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RecoverComponent } from './recover/recover.component';
import { ResetComponent } from './reset/reset.component';
import { AuthComponent } from './auth/auth.component';

// import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            // { path: 'signup', component: SignupComponent },
            { path: 'recover', component: RecoverComponent },
            { path: 'reset/email/:email/:token', component: ResetComponent },
            { path: '**', redirectTo: 'login', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
