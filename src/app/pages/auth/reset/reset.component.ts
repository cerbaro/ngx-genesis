import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    templateUrl: './reset.component.html',
    styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

    public formReset: FormGroup;

    constructor() { }

    ngOnInit() {

        this.formReset = new FormGroup({
            passwd: new FormControl('', [Validators.required, Validators.minLength(8)])
        });
    }

}
