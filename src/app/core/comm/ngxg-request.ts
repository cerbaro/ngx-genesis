import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { CDSResult, CDSError } from 'src/app/shared/types/cds-response';

@Injectable()
export class NgxgRequest implements OnDestroy {

    public ngxgUnsubscribe: Subject<void> = new Subject<void>();

    public result: CDSResult;
    public error: CDSError;

    constructor() { }

    public ngOnDestroy(): void {
        this.ngxgUnsubscribe.next();
        this.ngxgUnsubscribe.complete();
    }

    public setError(error: any): void {

        if (error.error.code) {
            this.error = error.error;
        } else {
            this.error = {} as CDSError;
            this.error.code = error.code;
            this.error.message = 'Opss.. Something went wrong and we\'re working to fix it. ('
                + error.statusText + ' ' + error.status + ')';
        }

    }

}





