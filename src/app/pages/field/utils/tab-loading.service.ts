import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class TabLoadingService {

    /**
     * Flag to show/hide global preloader
     */

    private loading: BehaviorSubject<Boolean>;

    constructor() {
        this.loading = new BehaviorSubject<Boolean>(true);
    }

    public getLoading(): Observable<Boolean> {
        return this.loading.asObservable();
    }

    public setLoading(loading: Boolean): void {
        this.loading.next(loading);
    }

}
