import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Field } from '../types/field';
import { Season } from '../types/season';

@Injectable()
export class DataExchangeService {

    private field: BehaviorSubject<Field>;
    private season: BehaviorSubject<Season>;

    constructor() {
        this.field = new BehaviorSubject<Field>(null);
        this.season = new BehaviorSubject<Season>(null);
    }

    public getField(): Observable<Field> {
        return this.field.asObservable();
    }

    public setField(field: Field): void {
        this.field.next(field);
    }

    public getSeason(): Observable<Season> {
        return this.season.asObservable();
    }

    public setSeason(season: Season): void {
        this.season.next(season);
    }


}
