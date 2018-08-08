import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/cds/auth.service';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';

@Component({
    templateUrl: './recover.component.html',
    styleUrls: ['./recover.component.scss']
})
export class RecoverComponent extends NgxgRequest implements OnInit {

    public formRecover: FormGroup;

    constructor(private auth: AuthService) {
        super();
    }

    ngOnInit() {

        this.formRecover = new FormGroup({
            email: new FormControl('', Validators.email)
        });

    }

    public recover() {

        if (this.formRecover.valid) {

            const fValues = this.formRecover.value;

            this.auth.recoverPassword({ user: fValues }).subscribe(
                result => {
                    this.result = result;
                },
                error => this.setError(error)
            );
        }

    }

}
