
export interface Field {

    _id?: string;
    admin?: boolean;

    name: string;
    act: boolean;

    users: {
        user: any;
        admin: boolean;
    }[];

    farm: any;

    weatherStations: string[];

    location: {
        lat: number;
        lon: number;
        geoid: string;
    };

    area: {
        size: number;
        shape: {
            type: string;
            coordinates: number[];
        };
    };

    pvt: boolean;
    elev: number;
    inclination: number;

    soil?: any;
    inf?: any;


    /**
     * Attributes for SmartCampo
     *
     */

    seasons?: any;

    app?: {
        season?: any;
        thumbnail?: string;
        link?: string;
        weather?: any;
    };

}
