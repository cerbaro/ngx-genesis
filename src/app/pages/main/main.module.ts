import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main/main.component';

import { LayoutComponentsModule } from 'src/app/shared/modules/layout-components.module';
import { NgxgLoadingService } from 'src/app/core/comm/ngxg-loading';
import { DataExchangeService } from 'src/app/shared/services/data-exchange.service';

import { ChartModule } from '@kiwigrid/ngx-highcharts';


/*
 * Highcharts modules and translation
 *
 */

import * as Highcharts from 'highcharts/highstock';
import { HighchartsStatic } from '@kiwigrid/ngx-highcharts/dist/HighchartsService';

export function highchartsFactory() {
    const hcm = require('highcharts/highcharts-more');
    const exp = require('highcharts/modules/exporting');
    const sg = require('highcharts/modules/solid-gauge');

    Highcharts.setOptions({
        lang: {
            rangeSelectorZoom: 'Mostrar: ',
            months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio',
                'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            shortMonths: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
        }
    } as any);

    hcm(Highcharts);
    exp(Highcharts);
    sg(Highcharts);
    return Highcharts;
}


@NgModule({
    imports: [
        CommonModule,
        MainRoutingModule,

        LayoutComponentsModule,

        ChartModule
    ],
    declarations: [MainComponent],
    providers: [
        NgxgLoadingService,
        DataExchangeService,
        { provide: HighchartsStatic, useFactory: highchartsFactory }
    ]
})
export class MainModule { }
