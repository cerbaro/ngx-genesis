import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import * as L from 'leaflet';

export class LeafletDraw {

    private numberOfLayers: Number;
    private autoEdit: Boolean;

    private layers: L.FeatureGroup;
    private drawControl: L.Control.Draw;

    private geoJSON = new BehaviorSubject<L.FeatureGroup>(new L.FeatureGroup());
    public geoJSON$ = this.geoJSON.asObservable();


    constructor(private map: any) {

        this.translateControl();
    }

    private translateControl(): void {
        (L as any).drawLocal = {
            draw: {
                toolbar: {
                    actions: {
                        title: 'Cancelar',
                        text: 'Cancelar'
                    },
                    finish: {
                        title: 'Terminar',
                        text: 'Terminar'
                    },
                    undo: {
                        title: 'Apagar último ponto',
                        text: 'Apagar último ponto'
                    },
                    buttons: {
                        polyline: 'Draw a polyline',
                        polygon: 'Desenhar um polígono',
                        rectangle: 'Draw a rectangle',
                        circle: 'Draw a circle',
                        marker: 'Draw a marker',
                        circlemarker: 'Draw a circlemarker'
                    }
                },
                handlers: {
                    circle: {
                        tooltip: {
                            start: 'Click and drag to draw circle.'
                        },
                        radius: 'Radius'
                    },
                    circlemarker: {
                        tooltip: {
                            start: 'Click map to place circle marker.'
                        }
                    },
                    marker: {
                        tooltip: {
                            start: 'Click map to place marker.'
                        }
                    },
                    polygon: {
                        tooltip: {
                            start: 'Clique para começar a desenhar.',
                            cont: 'Clique para continuar desenhando.',
                            end: 'Clique no primeiro ponto para terminar este desenho.'
                        }
                    },
                    polyline: {
                        error: '<strong>Error:</strong> shape edges cannot cross!',
                        tooltip: {
                            start: 'Click to start drawing line.',
                            cont: 'Click to continue drawing line.',
                            end: 'Click last point to finish line.'
                        }
                    },
                    rectangle: {
                        tooltip: {
                            start: 'Click and drag to draw rectangle.'
                        }
                    },
                    simpleshape: {
                        tooltip: {
                            end: 'Release mouse to finish drawing.'
                        }
                    }
                }
            },
            edit: {
                toolbar: {
                    actions: {
                        save: {
                            title: 'Gravar alterações',
                            text: 'Gravar'
                        },
                        cancel: {
                            title: 'Cancelar edição e descartar todas as alterações.',
                            text: 'Cancelar'
                        },
                        clearAll: {
                            title: 'Apagar tudo',
                            text: 'Apagar tudo'
                        }
                    },
                    buttons: {
                        edit: 'Editar',
                        editDisabled: 'Nada para editar',
                        remove: 'Apagar',
                        removeDisabled: 'Nada para apagar'
                    }
                },
                handlers: {
                    edit: {
                        tooltip: {
                            text: 'Arraste pontos para modificar o desenho.',
                            subtext: 'Clique em cancelar para desfazer as alterações.'
                        }
                    },
                    remove: {
                        tooltip: {
                            text: 'Clique em um ponto para removê-lo.'
                        }
                    }
                }
            }
        };
    }

    public initializeControls(autoEdit: Boolean) {
        this.autoEdit = autoEdit;

        this.layers = new L.FeatureGroup();
        this.map.addLayer(this.layers);

        this.addControl(true, false);

        this.map.on(L.Draw.Event.CREATED, (e) => {

            this.layers.addLayer(e.layer);
            this.numberOfLayers = Object.keys(this.layers['_layers']).length;

            if (this.numberOfLayers > 0) {

                this.checkEdit(this.layers);

                this.addControl(false, true);
                this.geoJSON.next(this.layers);
            }

        });

        this.map.on(L.Draw.Event.DELETED, (e) => {

            this.numberOfLayers = Object.keys(this.layers['_layers']).length;

            if (this.numberOfLayers === 0) {
                this.addControl(true, false);
                this.geoJSON.next(null);
            }

        });

        this.map.on(L.Draw.Event.EDITVERTEX, e => this.geoJSON.next(this.layers));


    }

    private addControl(draw: Boolean, edit: Boolean): void {

        if (this.drawControl) {
            this.map.removeControl(this.drawControl);
        }

        this.drawControl = this.createControl(draw, edit);

        this.map.addControl(this.drawControl);

    }

    private createControl(draw: Boolean, edit: Boolean): L.Control.Draw {
        return new L.Control.Draw({
            position: 'topright',
            draw: (draw) ? {
                polyline: false,
                circle: false,
                marker: false,
                circlemarker: false,
                rectangle: false,
                polygon: {
                    allowIntersection: false,
                    drawError: {
                        color: '#e1e100',
                        message: '<strong>Ops!<strong> Você não pode fazer isto!'
                    }
                }
            } : <any>false,
            edit: edit ? {
                edit: !this.autoEdit,
                featureGroup: this.layers
            } : <any>false
        });
    }

    public drawMonitor(): Observable<L.FeatureGroup> {
        return this.geoJSON$;
    }

    public loadDraw(geojson: any): void {
        this.checkEdit(geojson);

        this.addControl(false, true);

    }

    private checkEdit(drawn: any): void {

        if (this.autoEdit) {
            drawn.eachLayer(l => {
                l.options.editing = (l.options.editing) ? l.options.editing : {};
                l.editing.enable();
                this.layers.addLayer(l);
            });
        }

    }

}
