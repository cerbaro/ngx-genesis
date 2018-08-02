import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { Field } from 'src/app/shared/types/field';
import { FieldService } from 'src/app/shared/services/cds/field.service';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';

import * as L from 'leaflet';
import * as Turf from '@turf/turf';
import { DialogComponent } from 'src/app/shared/modules/dialog/dialog/dialog.component';


@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent extends NgxgRequest implements OnInit {

    private map: L.Map;
    private fieldAreaModified = 0;
    private fieldNotDrawn: Boolean = false;

    public editing: Boolean = false;
    public showIndicator: Boolean = true;

    public dataLoading: Boolean = true;

    public formField: FormGroup;

    public fieldID: String;
    public fieldGeoJSON: any;

    public sharableUserCtrl: FormControl = new FormControl();
    public filteredShdUsers: Observable<any[]>;
    public sharableUsers: Array<any> = [];

    public allSharableUsers: Array<any> = [];

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    @ViewChild('shrdUsrInput') shrdUsrInput: ElementRef;


    public farms: Array<any> = [
    ];

    constructor(
        private ngxgLoadingService: NgxgLoadingService,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private fieldService: FieldService,
        private dialog: MatDialog
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
            users: new FormControl(null),

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

        this.route.data.subscribe(
            data => {
                this.farms = data.farms;
                this.allSharableUsers = data.users;
            });

        this.route.params
            .subscribe((params: Params) => {

                if (params['field']) {
                    this.loadFieldData(params['field']);
                    this.editing = true;
                } else {
                    this.pageLoaded();
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

    private pageLoaded(): void {
        setTimeout(() => {
            this.dataLoading = false;
            this.ngxgLoadingService.setLoading(this.dataLoading);
        });
    }

    private loadFieldData(fieldID: string): void {

        this.fieldID = fieldID;

        this.fieldService.getField(this.fieldID)
            .pipe(takeUntil(this.ngxgUnsubscribe))
            .subscribe(result => {

                const field = result.data;

                /**
                 * Load Users
                 */
                this.sharableUsers = this.allSharableUsers.filter(shdUser => {
                    return field.users.findIndex(user => user.user === shdUser._id) !== -1;
                });

                /**
                 * Load Form
                 */
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

                this.pageLoaded();
            });
    }

    public submit(): void {

        if (this.formField.valid) {

            this.formField.get('users').setValue(
                this.sharableUsers.map(user => {
                    return { user: user._id, admin: 1 };
                }));

            const field = this.formField.value;

            if (!this.editing || this.fieldAreaModified >= 1 || this.formField.get('location').get('geoid').value === '') {

                this.fieldService.getFieldGeoID(field.location).subscribe(
                    result => {

                        this.formField.get('location').get('geoid').setValue(result.data._id);
                        field.location.geoid = (result.data._id);

                        this.persistField(field);

                    },
                    error => this.setError(error));

            } else {
                this.persistField(field);
            }

        } else {

            if (!this.editing && this.fieldAreaModified === 0) {
                this.fieldNotDrawn = true;
            }
        }
    }

    private persistField(field: Field): void {

        if (this.editing) {

            field._id = this.fieldID.toString();

            this.fieldService.updateField(this.fieldID, { field: field }).subscribe(
                result => {

                    this.fieldService.updatePostGIS(this.fieldID, { geom: field.area.shape.coordinates }).subscribe(
                        res => {
                            this.result = result;
                            this.location.back();
                        },
                        err => this.setError(err)
                    );
                },
                error => this.setError(error)
            );

        } else {

            this.fieldService.createField({ field: field }).subscribe(
                result => {

                    this.fieldService.createPostGIS({ _id: result.data['_id'], geom: field.area.shape.coordinates }).subscribe(
                        res => {
                            this.result = result;
                            this.router.navigate(['/field/', this.result.data['_id']]);
                        },
                        err => this.setError(err));

                },
                error => this.setError(error)
            );

        }

    }

    public cancel(event: any): void {
        this.location.back();
    }

    /**
     * Delete Field
     */
    public deleteDialog(): void {
        const dialogRef = this.dialog.open(DialogComponent, {
            width: '350px',
            data: {
                title: 'Apagar campo',
                content: 'Tem certeza que deseja apagar esta campo? Esta operação é irreversível',
                actions: [
                    { text: 'Cancelar', value: false },
                    { text: 'Apagar', value: true }
                ]
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.fieldService.deleteField(this.fieldID)
                    .subscribe(() => this.router.navigate(['/fields']));
            }

        });
    }


    /**
     * Auto Complete functions
     */

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
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
            return this.allSharableUsers
                .filter(susers => this.sharableUsers.findIndex(su => (su.email === susers.email)) === -1)
                .filter(user => user.name.toLowerCase().includes(filterValue))
                .filter(user => this.sharableUsers.length === 0 || this.sharableUsers.some(suser => !(suser.email === user.email)));
        }
    }


    /**
     * Field Map functions
     */

    public getDraw(layers: L.FeatureGroup) {

        if (layers != null) {
            this.fieldNotDrawn = false;

            if (layers.getLayers().length > 0) {
                this.fieldAreaModified = this.fieldAreaModified + 1;
            }

            L.geoJSON(layers.toGeoJSON(), {
                onEachFeature: (f: any) => {

                    this.formField.get('location').setValue({
                        lat: Turf.center(f).geometry.coordinates[1],
                        lon: Turf.center(f).geometry.coordinates[0],
                        geoid: ''
                    });

                    this.formField.get('area').get('size').setValue(Turf.area(f));
                    this.formField.get('area').get('shape').setValue({
                        type: f.geometry.type,
                        coordinates: f.geometry.coordinates
                    });

                    this.fieldGeoJSON = f;
                }
            });

        } else {
            this.fieldNotDrawn = true;
            this.fieldAreaModified = 0;

            this.formField.get('location').setValue({ lat: '', lon: '', geoid: '' });
            this.formField.get('area').setValue({ size: '', shape: { type: '', coordinates: '' } });
        }

    }

    public getMapInstance(mp: L.Map): void {
        this.map = mp;

        this.map.on(L.Draw.Event.DRAWSTART, (e) => {
            this.showIndicator = false;
        });
    }

}

