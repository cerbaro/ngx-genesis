import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class NgxgLoadingService {

    /**
     * Flag to show/hide global preloader
     */

    private l: Subject<Boolean>;
    public loading: Boolean;

    constructor() {
        this.l = new Subject<Boolean>();
    }

    public getLoading(): Observable<Boolean> {
        return this.l.asObservable();
    }

    public setLoading(loading: Boolean): void {
        this.loading = loading;
        this.l.next(this.loading);
    }

}
