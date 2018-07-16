import { Directive, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import * as L from 'leaflet';
import { LeafletService } from '../services/leaflet.service';
import * as mapTypes from '../map.types';

@Directive({
    selector: '[ngxgPopup]'
})
export class PopupDirective implements AfterContentInit {

    public innerHtml: HTMLElement;

    @Input() content: string;
    @Input() options: mapTypes.PopupOptions;

    @Output() click: EventEmitter<mapTypes.PopupOptions> = new EventEmitter<mapTypes.PopupOptions>();

    constructor(private leafletService: LeafletService) { }

    ngAfterContentInit() {
        const innerDiv = L.DomUtil.create('div', 'popup-content-wrapper');
        innerDiv.innerHTML = this.content;
        this.innerHtml = innerDiv;
    }

    public init(): void {
        this.addEvents();
    }

    public open(): void {
        this.leafletService.openPopup(this).subscribe();
    }

    private addEvents(): void {
        this.leafletService.createPopupObservable('click', this).subscribe(() => {
            this.click.emit(this.options);
        });
    }
}
