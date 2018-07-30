import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { ActivatedRoute, Params } from '@angular/router';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { Field } from 'src/app/shared/types/field';
import { FieldService } from 'src/app/shared/services/cds/field.service';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';


@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent extends NgxgRequest implements OnInit {

    public editing: Boolean = false;
    public dataLoading: Boolean = true;

    public formField: FormGroup;

    public fieldID: String;
    public fieldGeoJSON: any;

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


    public farms: Array<any> = [
        { _id: '5b5727d0ee75df60675b9bf2', name: 'Vinicius' },
        { _id: '', name: 'Mauricio' },
        { _id: '', name: 'Clyde' },
        { _id: '', name: 'Eduardo' }
    ];

    constructor(
        private ngxgLoadingService: NgxgLoadingService,
        private location: Location,
        private route: ActivatedRoute,
        private fieldService: FieldService
    ) {
        super();
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
            farm: new FormControl(null),
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

        this.route.params
            .subscribe((params: Params) => {

                if (params['field']) {
                    this.loadField(params['field']);
                    this.editing = true;
                } else {
                    console.log('Create new');
                }

            });


        /**
         * Timeout to avoid Error
         * ExpressionChangedAfterItHasBeenCheckedError
         */

        setTimeout(() => {
            this.ngxgLoadingService.setLoading(this.dataLoading);
        });

    }

    private loadField(fieldID: string): void {

        this.fieldID = fieldID;

        this.fieldService.getField(this.fieldID)
            .pipe(takeUntil(this.ngxgUnsubscribe))
            .subscribe(result => this.loadFormField(result.data));
    }

    private loadFormField(field: Field): void {

        Object.keys(this.formField.value).forEach(key => {
            if (field[key]) {
                if (key === 'farm') {
                    this.formField.get(key).setValue(this.farms.find(farm => farm._id === field[key]));
                } else {
                    this.formField.get(key).setValue(field[key]);
                }
            }
        });

        this.fieldGeoJSON = {
            'type': field.area.shape.type,
            'coordinates': field.area.shape.coordinates
        };

        this.dataLoading = false;
        this.ngxgLoadingService.setLoading(this.dataLoading);
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

