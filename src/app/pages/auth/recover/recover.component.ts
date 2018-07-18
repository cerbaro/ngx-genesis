import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    templateUrl: './recover.component.html',
    styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {

    public formRecover: FormGroup;

    constructor() { }

    ngOnInit() {

        this.formRecover = new FormGroup({
            email: new FormControl('', Validators.email)
        });

    }

}
