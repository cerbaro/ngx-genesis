import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NgxgUnsubscribe implements OnDestroy {

    public ngxgUnsubscribe: Subject<void> = new Subject<void>();

    constructor() { }

    public ngOnDestroy(): void {
        this.ngxgUnsubscribe.next();
        this.ngxgUnsubscribe.complete();
    }

}





