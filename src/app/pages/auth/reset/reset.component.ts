import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/cds/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';

import { Md5 } from 'ts-md5/dist/md5';

@Component({
    templateUrl: './reset.component.html',
    styleUrls: ['./reset.component.scss']
})
export class ResetComponent extends NgxgRequest implements OnInit {

    private email: String;
    private token: String;

    public tokenValid: Boolean;

    public formReset: FormGroup;


    constructor(private auth: AuthService, private route: ActivatedRoute, private router: Router) {
        super();

        this.email = this.route.snapshot.params.email;
        this.token = this.route.snapshot.params.token;

        this.auth.validateResetToken(this.email, this.token).subscribe(
            result => {
                this.tokenValid = true;
            },
            error => {
                this.tokenValid = false;
                this.setError(error);
            }
        );
    }

    ngOnInit() {

        this.formReset = new FormGroup({
            passwd: new FormControl('', [Validators.required, Validators.minLength(8)])
        });

        this.formReset = new FormGroup({
            email: new FormControl(this.email),
            recovery: new FormGroup({
                passwd: new FormGroup({
                    token: new FormControl(this.token)
                })
            }),
            passwordGroup: new FormGroup({
                passwd: new FormControl('', [Validators.required, Validators.minLength(8)]),
                passwdConfirm: new FormControl('', [Validators.required, Validators.minLength(8)]),
            }, this.passwordMatchValidator)
        });

    }

    public reset() {

        if (this.formReset.valid) {

            const fValues = this.formReset.value;

            fValues.passwd = Md5.hashStr(fValues.passwordGroup.passwd).toString();
            delete fValues.passwordGroup;

            this.auth.resetPassword({ user: fValues }).subscribe(
                result => {
                    this.result = result;
                },
                error => this.setError(error)
            );
        }

    }

    private passwordMatchValidator(g: FormGroup) {
        return g.get('passwd').value === g.get('passwdConfirm').value ? null : { 'mismatch': true };
    }

}
