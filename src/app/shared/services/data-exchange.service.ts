import { Injectable } from '@angular/core';
import { Field } from '../types/field';
import { Subject } from 'rxjs';
import { Season } from '../types/season';

@Injectable()
export class DataExchangeService {

    public f: Subject<Field>;
    public field: Field;

    public s: Subject<Season>;
    public season: Season;

    constructor() {
        this.f = new Subject<Field>();
        this.s = new Subject<Season>();
    }

    public setField(field): void {
        this.field = field;
        this.f.next(this.field);
    }

    public setSeason(season): void {
        this.season = season;
        this.s.next(this.season);
    }

}
