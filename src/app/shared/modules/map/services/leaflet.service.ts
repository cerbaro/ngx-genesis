import { Injectable } from '@angular/core';
import { Observer, Observable } from 'rxjs';

import { LeafletDraw } from './leafletDraw';
import { LeafletLocate } from './leafletLocate';

import { GeoJSONDirective } from '../directives/geojson.directive';
import { MarkerDirective } from '../directives/marker.directive';
import { PopupDirective } from '../directives/popup.directive';

import * as L from 'leaflet';

export class LeafletService {

    public id: string;
    public map: L.Map;
    public options: any;
    public lldraw: LeafletDraw;

    private baseMaps: any;
    private lllocate: LeafletLocate;

    private markerCluster: L.MarkerClusterGroup = L.markerClusterGroup();
    private markerList: Map<MarkerDirective, L.Marker> = new Map<MarkerDirective, L.Marker>();

    private geoJSONList: Map<GeoJSONDirective, L.GeoJSON> = new Map<GeoJSONDirective, L.GeoJSON>();

    private popupList: Map<PopupDirective, L.Popup> = new Map<PopupDirective, L.Popup>();


    private tileMap = 'https://api.tiles.mapbox.com/v4/';
    private accessToken = 'pk.eyJ1IjoiZG9yaXNsaXUyMTciLCJhIjoiY2oybHdydzRpMDBpZzMzdGp5ODJkamJlYiJ9.FwtouO3HW1pn5gsg7nKC5g';

    constructor() { }

    public initMap(id: string, options: any): Observable<L.Map> {

        return Observable.create((observer: Observer<L.Map>) => {
            this.id = id;
            this.options = options;

            this.map = L.map(this.id, { attributionControl: false })
                .setView([this.options.latitude, this.options.longitude], this.options.zoom);

            this.loadBaseMaps(this.options.basemap);
            this.initControls(this.options.controls);

            this.map.addLayer(this.markerCluster);

            this.fitMapTo(this.options.fitMapTo);

            observer.next(this.map);
            observer.complete();
        });

    }

    public createMapObservable(eventName: string): Observable<L.LeafletEvent> {
        return Observable.create((observer: Observer<L.LeafletEvent>) => {
            this.map.on(eventName, (e: L.LeafletEvent) => observer.next(e));
        });
    }

    public setBaseMap(basemap: string = 'MapBox'): void {
        if (this.baseMaps.hasOwnProperty(basemap)) {
            this.baseMaps[basemap].addTo(this.map);
        }
    }

    public fitMapTo(fitMapTo: string = null): void {
        switch (fitMapTo) {
            case null:
                break;
            case 'locate':
                this.map.locate({
                    setView: true,
                    maxZoom: 15
                });
                break;
            case 'marker':
                if (this.markerList.size > 0) {
                    this.map.fitBounds(L.featureGroup(Array.from(this.markerList.values())).getBounds());
                }
                break;
            case 'geojson':
                if (this.geoJSONList.size > 0) {
                    this.map.fitBounds(L.featureGroup(Array.from(this.geoJSONList.values())).getBounds());
                }
                break;
            default:
                break;
        }
    }

    public getTileImageURL(
        latLon: L.LatLng | [number, number],
        geoJSON: Object = null,
        mapBase: string = 'mapbox.satellite',
        zoom: number = 16, width: number = 512,
        height: number = 512): string {

        let lat;
        let lon;

        if (latLon instanceof L.LatLng) {
            lat = latLon.lat;
            lon = latLon.lng;
        } else {
            lat = latLon[0];
            lon = latLon[1];
        }

        let url = this.tileMap + mapBase + '/';

        if (geoJSON) {
            url += 'geojson(' + JSON.stringify(geoJSON) + ')/auto/';
        } else {
            url += lon + ',' + lat + ',' + zoom + '/';
        }
        url += width + 'x' + height + '.png?access_token=' + this.accessToken;

        return url;

    }

    private initControls(controls): void {

        if (typeof (controls) !== 'undefined') {
            if (controls.baseMaps) {
                L.control.layers(this.baseMaps, null, { position: 'topright' }).addTo(this.map);
            }

            if (controls.draw) {
                this.lldraw = new LeafletDraw(this.map);
                this.lldraw.initializeControls(true);
            }

            if (controls.locate) {
                this.lllocate = new LeafletLocate(this.map);
                this.lllocate.initializeControls();
            }


        }

    }

    private loadBaseMaps(basemap: string = 'Hybrid'): void {

        this.baseMaps = {
            Hybrid: new L.TileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.accessToken, {
                id: 'mapbox.streets-satellite'
            }),
            Streets: new L.TileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.accessToken, {
                id: 'mapbox.streets'
            }),
            // Dark: new L.TileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=' + this.accessToken, {
            //     id: 'dark-v9'
            // }),
            Light: new L.TileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token=' + this.accessToken, {
                id: 'light-v9'
            })
        };

        if (this.baseMaps.hasOwnProperty(basemap)) {
            this.baseMaps[basemap].addTo(this.map);
        } else {
            this.baseMaps['MapBox'].addTo(this.map);
        }

    }

    private mapColor(feature): any {
        return {
            fillColor: feature.properties['fillColor'] || '#EBD740',
            fillOpacity: feature.properties['fillOpacity'] || 0.3,
            color: feature.properties['#757575'] || '#EBD140',
            weight: feature.properties['strokeWidth'] || 1,
            opacity: feature.properties['strokeOpacity'] || 1
        };
    }


    /*
     * Markers
     *
     */

    public addMarker(marker: MarkerDirective): Observable<L.Marker> {

        return Observable.create((observer: Observer<L.Marker>) => {

            const myIcon = L.divIcon(marker.options.divIconOptions);

            const currentMarker = L.marker([
                marker.options.latitude,
                marker.options.longitude
            ], { icon: myIcon });

            this.markerCluster.addLayer(currentMarker);
            this.markerList.set(marker, currentMarker);

            observer.next(currentMarker);
            observer.complete();

        });

    }

    public hideMarker(marker: MarkerDirective): Observable<void> {

        return Observable.create((observer: Observer<void>) => {

            this.markerCluster.removeLayer(this.markerList.get(marker));

            observer.next(null);
            observer.complete();

        });

    }

    public showMarker(marker: MarkerDirective): Observable<void> {

        return Observable.create((observer: Observer<void>) => {

            this.markerCluster.addLayer(this.markerList.get(marker));

            observer.next(null);
            observer.complete();

        });

    }

    public removeMarker(marker: MarkerDirective): Observable<void> {

        return Observable.create((observer: Observer<void>) => {

            this.markerCluster.removeLayer(this.markerList.get(marker));
            this.markerList.delete(marker);

            observer.next(null);
            observer.complete();

        });

    }

    public createMarkerObservable(eventName: string, marker: MarkerDirective): Observable<L.LeafletEvent> {
        return Observable.create((observer: Observer<L.LeafletEvent>) => {
            this.markerList.get(marker).addEventListener(eventName, (e: L.LeafletEvent) => observer.next(e));
        });
    }



    /*
     * GeoJSON
     *
     */

    public addGeoJSON(geoJSON: GeoJSONDirective): Observable<L.GeoJSON> {

        return Observable.create((observer: Observer<L.GeoJSON>) => {
            const currentLayer = L.geoJSON(geoJSON.options.geojson, { style: this.mapColor });
            currentLayer.addTo(this.map);
            this.geoJSONList.set(geoJSON, currentLayer);

            observer.next(currentLayer);
            observer.complete();
        });

    }

    public hideGeoJSON(geoJSON: GeoJSONDirective): Observable<void> {

        return Observable.create((observer: Observer<void>) => {

            this.geoJSONList.get(geoJSON).removeFrom(this.map);

            observer.next(null);
            observer.complete();

        });

    }

    public showGeoJSON(geoJSON: GeoJSONDirective): Observable<void> {

        return Observable.create((observer: Observer<void>) => {

            this.geoJSONList.get(geoJSON).addTo(this.map);

            observer.next(null);
            observer.complete();

        });

    }

    public removeGeoJSON(geoJSON: GeoJSONDirective): Observable<void> {

        return Observable.create((observer: Observer<void>) => {

            this.geoJSONList.get(geoJSON).removeFrom(this.map);
            this.geoJSONList.delete(geoJSON);

            observer.next(null);
            observer.complete();

        });

    }

    public createGeoJSONObservable(eventName: string, geoJSON: GeoJSONDirective): Observable<L.LeafletEvent> {
        return Observable.create((observer: Observer<L.LeafletEvent>) => {
            this.geoJSONList.get(geoJSON).addEventListener(eventName, (e: L.LeafletEvent) => observer.next(e));
        });
    }



    /*
     * Popups
     *
     */

    public bindPopup(element: L.Marker | L.GeoJSON | L.LatLng | [number, number], popup: PopupDirective): Observable<void> {

        return Observable.create((observer: Observer<void>) => {
            let latLong;

            if (element instanceof L.Marker) {
                latLong = element.getLatLng();
            } else if (element instanceof L.GeoJSON) {
                latLong = element.getBounds().getCenter();
            } else {
                latLong = element;
            }

            const currentPopup = L.popup().setLatLng(latLong).setContent(popup.innerHtml);

            this.popupList.set(popup, currentPopup);

            observer.next(null);
            observer.complete();
        });

    }

    public openPopup(popup: PopupDirective): Observable<void> {
        return Observable.create((observer: Observer<void>) => {
            this.popupList.get(popup).openOn(this.map);

            observer.next(null);
            observer.complete();
        });
    }

    public closePopup(popup: PopupDirective): Observable<void> {
        return Observable.create((observer: Observer<void>) => {
            this.popupList.get(popup).closePopup();

            observer.next(null);
            observer.complete();
        });
    }

    public createPopupObservable(eventName: string, popup: PopupDirective): Observable<L.LeafletEvent> {
        return Observable.create((observer: Observer<L.LeafletEvent>) => {
            // console.log(this.popupList.get(popup).getContent())

            observer.next(null);
            observer.complete();
        });
    }



    /*
     * Draw
     *
     */

    public loadDraw(llgeojson: any): Observable<void> {
        return Observable.create((observer: Observer<void>) => {

            this.lldraw.loadDraw(llgeojson);

            observer.next(null);
            observer.complete();
        });
    }

    public drawMonitor(): Observable<L.FeatureGroup> {
        return this.lldraw.drawMonitor();
    }


}

