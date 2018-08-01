
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
        loc?: any;
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
        season?: {
            prev?: any;
            current?: any;
            next?: any;
            display?: any;

            proc?: any;
        };
        map?: {
            geojson?: any;
            divIconOptions?: any;
        };
        thumbnail?: string;
        link?: string;
        weather?: any;
        climate?: any;
        hidden?: boolean;
    };

}
