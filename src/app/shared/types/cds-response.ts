export interface CDSError {
    code: string;
    message: string;
}

export interface CDSResult {
    data: Object;
    error: Boolean;
    message: string;
}
