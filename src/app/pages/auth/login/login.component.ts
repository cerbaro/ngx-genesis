import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import { AuthService } from 'src/app/shared/services/cds/auth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public formSignin: FormGroup;

    constructor(private auth: AuthService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {

        this.formSignin = new FormGroup({
            email: new FormControl('', Validators.email),
            passwd: new FormControl('', [Validators.required, Validators.minLength(8)]),
            remember: new FormControl(false)
        });

    }

    public signIn(): void {

        if (this.formSignin.valid) {

            const redirectTo = this.route.snapshot.queryParams['returnto'] || '/';

            const fValues = this.formSignin.value;
            const remember = fValues.remember;
            delete fValues.remember;

            fValues.passwd = Md5.hashStr(fValues.passwd).toString();

            this.auth.signin({ user: fValues }).subscribe(
                result => {

                    if (remember) {
                        localStorage.setItem('SMAAccessToken', result.data.token);
                    } else {
                        sessionStorage.setItem('SMAAccessToken', result.data.token);
                    }

                    this.router.navigate([redirectTo]);

                },
                error => console.log(error)
            );

        }

    }

}
