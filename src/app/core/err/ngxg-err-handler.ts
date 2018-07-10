import { Injectable, ErrorHandler } from '@angular/core';

@Injectable()
export class NgxgErrHandler implements ErrorHandler {

    constructor() { }

    handleError(error) {

        console.log(error);

        if (error.status === 400) {
            window.location.href = '/';
        }

        // IMPORTANT: Rethrow the error otherwise it gets swallowed
        throw error;
    }

}
