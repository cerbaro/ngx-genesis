import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Location } from '@angular/common';

@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

    public dataLoading: Boolean;
    public formField: FormGroup;
    public sharableUserCtrl: FormControl = new FormControl();

    public filteredShdUsers: Observable<any[]>;

    public sharableUsers: Array<any> = [
        { name: 'Vinicius' }
    ];

    public allSharableUsers: Array<any> = [
        { name: 'Vinicius' },
        { name: 'Mauricio' },
        { name: 'Clyde' },
        { name: 'Eduardo' }
    ];

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    @ViewChild('shrdUsrInput') shrdUsrInput: ElementRef;

    constructor(private ngxgLoadingService: NgxgLoadingService, private location: Location) {
        this.dataLoading = true;
    }

    ngOnInit() {
        this.filteredShdUsers = this.sharableUserCtrl.valueChanges.pipe(
            startWith(null),
            map((user: any | null) => user ? this._filter(user) : null)
        );

        this.formField = new FormGroup({
            name: new FormControl(null, Validators.required),
            location: new FormGroup({
                lat: new FormControl(null, Validators.required),
                lon: new FormControl(null, Validators.required),
                geoid: new FormControl(null)
            }),
            area: new FormGroup({
                size: new FormControl(null, Validators.required),
                shape: new FormGroup({
                    type: new FormControl(null, Validators.required),
                    coordinates: new FormControl(null, Validators.required),
                })
            }, Validators.required),
            elev: new FormControl(null),
            inclination: new FormControl(null)
        });

        /**
         * Timeout to avoid Error
         * ExpressionChangedAfterItHasBeenCheckedError
         */

        setTimeout(() => {
            this.ngxgLoadingService.setLoading(this.dataLoading);
        });

        setTimeout(() => {

            this.dataLoading = false;
            this.ngxgLoadingService.setLoading(this.dataLoading);

        });
    }

    public submit(): void {
        if (this.formField.valid) {

            const fValues = this.formField.value;

        }
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // if ((value || '').trim()) {
        //     this.sharableUsers.push({ name: value.trim() });
        // }

        // if (input) {
        //     input.value = '';
        // }

        // this.sharableUserCtrl.setValue(null);
    }

    remove(user: any): void {
        const index = this.sharableUsers.indexOf(user);

        if (index >= 0) {
            this.sharableUsers.splice(index, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.sharableUsers.push(event.option.value);
        this.shrdUsrInput.nativeElement.value = '';
        this.sharableUserCtrl.setValue(null);
    }

    private _filter(value: any): any[] {
        if (typeof value === 'string') {
            const filterValue = value.toLowerCase();
            return this.allSharableUsers.filter(susers => this.sharableUsers.findIndex(su => su.name === susers.name) === -1)
                .filter(user => user.name.toLowerCase().includes(filterValue))
                .filter(user => this.sharableUsers.length === 0 || this.sharableUsers.some(suser => !(suser['name'] === user.name)));
        }
    }

    public cancel(event: any): void {
        this.location.back();
    }

}

