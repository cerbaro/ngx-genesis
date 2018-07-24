
export interface Farm {

    _id?: string;

    name: string;
    act: boolean;

    users?: {
        user: any;
        admin: boolean;
    }[];

    geoid?: string;

    elev?: number;
    utcOffset?: number;
    zoneName?: string;

    inf?: any;


}
