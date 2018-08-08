import { Component, OnInit } from '@angular/core';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { DataExchangeService } from 'src/app/shared/services/data-exchange.service';

import { Observable, forkJoin, pipe } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';

import { Field } from 'src/app/shared/types/field';
import { TabLoadingService } from 'src/app/pages/field/utils/tab-loading.service';
import { AgroGISService } from 'src/app/shared/services/agrogis/agrogis.service';


interface Chart {
    options: any;
    instance?: any;
}

interface Map {
    options: any;
    instance?: any;
}

@Component({
    templateUrl: './climate.component.html',
    styleUrls: ['./climate.component.scss']
})
export class ClimateComponent extends NgxgRequest implements OnInit {

    public field: Field;
    public tabLoading: Boolean;

    public charts: any;
    public maps: any;

    constructor(
        private tabLoadingService: TabLoadingService,
        private dataExchangeService: DataExchangeService,
        private agrogisService: AgroGISService
    ) {
        super();

        this.tabLoading = true;
    }

    ngOnInit() {

        this.dataExchangeService.getField().pipe(
            // delay(1000),
            takeUntil(this.ngxgUnsubscribe)
        ).subscribe(
            field => {
                this.field = field;

                this.buildCharts();

                /**
                 * Timeout to avoid Error
                 * ExpressionChangedAfterItHasBeenCheckedError
                 */

                setTimeout(() => {
                    this.tabLoading = false;
                    this.tabLoadingService.setLoading(false);
                    this.loadData();
                }, 1000);

            }
        );

    }

    public saveChartInstance(chart: string, instance: any): void {

        this.charts[chart].instance = instance;
        instance.showLoading('Carregando dados...');

    }

    private buildCharts(): void {

        this.charts = {
            climatology: {
                options: {
                    title: {
                        text: null
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    tooltip: {
                        split: false,
                        shared: true
                    },
                    xAxis: {
                        categories: ['Janeiro', 'Fevereiro', 'Março', 'Abril',
                            'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
                    },
                    yAxis: [{
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        labels: {
                            format: '{value}ºC',
                            align: 'left',
                            style: {
                                color: 'rgb(0,0,0)'
                            },
                            x: 10
                        },
                        title: {
                            text: null,
                        },
                        opposite: true
                    }, {
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        title: {
                            text: null,
                        },
                        labels: {
                            format: '{value} mm',
                            align: 'right',
                            style: {
                                color: 'rgb(0, 0, 0)'
                            },
                            x: -10
                        }
                    }],

                    series: [{
                        name: 'Chuva',
                        data: [],
                        yAxis: 1,
                        type: 'column',
                        color: 'rgba(135,180,231,.4)',
                        tooltip: {
                            valueDecimals: 0,
                            valueSuffix: ' mm'
                        }
                    }, {
                        name: 'Temperatura Máxima',
                        data: [],
                        type: 'spline',
                        color: 'rgba(255,0,0, .7)',
                        tooltip: {
                            valueDecimals: 0,
                            valueSuffix: '°C'
                        }
                    }, {
                        name: 'Temperatura Média',
                        data: [],
                        type: 'spline',
                        color: 'rgba(155,155,0, .7)',
                        tooltip: {
                            valueDecimals: 0,
                            valueSuffix: '°C'
                        }
                    }, {
                        name: 'Temperatura Mínima',
                        data: [],
                        type: 'spline',
                        color: 'rgba(0,0,255, .7)',
                        tooltip: {
                            valueDecimals: 0,
                            valueSuffix: '°C'
                        }
                    }]
                }
            } as Chart
        };

    }

    private loadData(): void {

        const variables = [
            { variable: 'totR', source: 'ensoag', version: 'v4', band: 1 },
            { variable: 'maxT', source: 'ensoag', version: 'v1', band: 1 },
            { variable: 'avgT', source: 'ensoag', version: 'v1', band: 1 },
            { variable: 'minT', source: 'ensoag', version: 'v1', band: 1 }
        ];

        const climatologyObservable = [].concat.apply([], variables.map(variable =>
            this.agrogisService.getClimatology(this.field.location, variable.variable, variable.version, variable.band, variable.source)
        )) as Observable<any>[];

        forkJoin(climatologyObservable)
            .pipe(takeUntil(this.ngxgUnsubscribe))
            .subscribe(results => {
                results.forEach(result => {
                    if (result !== null) {
                        let series = 0;

                        if (result[0].variable === 'maxTHis') {
                            series = 1;

                        } else if (result[0].variable === 'minTHis') {
                            series = 3;
                        } else if (result[0].variable === 'avgTHis') {
                            series = 2;
                        }

                        this.charts.climatology.instance.series[series].setData(result.map(res => res.avg));
                        this.charts.climatology.instance.hideLoading();
                    }
                });
            });

    }

}
