import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/shared/services/auth/guard.service';

const routes: Routes = [
    { path: 'auth', loadChildren: './pages/auth/auth.module#AuthModule' },
    { path: '', loadChildren: './pages/main/main.module#MainModule', canActivate: [AuthGuardService] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        AuthGuardService
    ]
})
export class AppRoutingModule { }
