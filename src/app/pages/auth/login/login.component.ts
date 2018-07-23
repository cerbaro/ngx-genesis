import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import { AuthService } from 'src/app/shared/services/cds/auth.service';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends NgxgRequest implements OnInit {

    public formSignin: FormGroup;
    public loggingIn: Boolean = false;

    constructor(
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super();

        if (this.auth.isSignedin()) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {

        this.formSignin = new FormGroup({
            email: new FormControl('', Validators.email),
            passwd: new FormControl('', [Validators.required, Validators.minLength(8)]),
            remember: new FormControl(false)
        });

    }

    public signIn(): void {

        if (this.formSignin.valid) {

            this.loggingIn = true;

            const redirectTo = this.route.snapshot.queryParams['returnto'] || '/';

            const fValues = this.formSignin.value;
            const remember = fValues.remember;
            delete fValues.remember;

            fValues.passwd = Md5.hashStr(fValues.passwd).toString();

            this.auth.signin({ user: fValues }).pipe(takeUntil(this.ngxgUnsubscribe)).subscribe(
                result => {

                    if (remember) {
                        localStorage.setItem('SMAAccessToken', result.data.token);
                    } else {
                        sessionStorage.setItem('SMAAccessToken', result.data.token);
                    }

                    this.router.navigate([redirectTo]);

                    setTimeout(() => {
                        this.loggingIn = false;
                    }, 1000);


                },
                error => {
                    this.loggingIn = false;
                    this.setError(error);
                }
            );

        }

    }

}
