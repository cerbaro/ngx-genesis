import { Injectable } from '@angular/core';
import { Field } from '../types/field';
import { Subject } from 'rxjs';

@Injectable()
export class DataShareService {

    public f: Subject<Field>;

    public field: Field;

    constructor() {
        this.f = new Subject<Field>();
    }

    public setField(field): void {
        this.field = field;
        this.f.next(this.field);
    }

}
