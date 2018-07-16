import * as L from 'leaflet';

export interface MapOptions {

    latitude: number;
    longitude: number;

    zoom?: number;
    basemap?: string;

    controls?: {
        draw: boolean;
        locate: boolean;
        baseMaps: boolean;
    };

    fitMapTo?: string;
}

export interface GeojsonOptions {

    title: string;

    editable?: boolean;
    visible?: boolean;
    clickable?: boolean;
    zIndex?: number;

    fillColor: string;
    fillOpacity: number;
    strokeColor: string;
    strokeWeight: number;
    strokeOpacity: number;

    geojson?: any;
}

export interface MarkerOptions {

    latitude: number;
    longitude: number;

    title: string;

    visible?: boolean;
    clickable?: boolean;
    zIndex?: number;

    divIconOptions?: L.DivIconOptions;

}

export interface PopupOptions {

    content: string;

}
