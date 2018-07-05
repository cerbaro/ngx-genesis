import { Injectable } from '@angular/core';
import { LatLng } from 'leaflet';

@Injectable()
export class MapBoxService {

    constructor() { }

    public getTileImageURL(
        latLon: LatLng | [number, number],
        geoJSON: Object = null,
        mapBase: string = 'mapbox.satellite',
        zoom: number = 16,
        width: number = 512,
        height: number = 512): string {

        const tileMap = 'https://api.tiles.mapbox.com/v4/';
        const accessToken = 'pk.eyJ1IjoiZG9yaXNsaXUyMTciLCJhIjoiY2oybHdydzRpMDBpZzMzdGp5ODJkamJlYiJ9.FwtouO3HW1pn5gsg7nKC5g';

        let lat;
        let lon;

        if (latLon instanceof LatLng) {
            lat = latLon.lat;
            lon = latLon.lng;
        } else {
            lat = latLon[0];
            lon = latLon[1];
        }

        let url = tileMap + mapBase + '/';

        if (geoJSON) {
            url += 'geojson(' + JSON.stringify(geoJSON) + ')/auto/';
        } else {
            url += lon + ',' + lat + ',' + zoom + '/';
        }

        url += width + 'x' + height + '.png?access_token=' + accessToken;

        return url;

    }

}
