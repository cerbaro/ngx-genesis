import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public formSignin: FormGroup;

    constructor() { }

    ngOnInit() {

        this.formSignin = new FormGroup({
            email: new FormControl('', Validators.email),
            passwd: new FormControl('', [Validators.required, Validators.minLength(8)]),
            remember: new FormControl(false)
        });

    }

}
