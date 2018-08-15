import { Component, OnInit } from '@angular/core';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { DataExchangeService } from 'src/app/shared/services/data-exchange.service';
import { takeUntil, delay } from 'rxjs/operators';
import { Field } from 'src/app/shared/types/field';
import { TabLoadingService } from 'src/app/pages/field/utils/tab-loading.service';

import * as moment from 'moment';
moment.locale('pt-br');

interface Chart {
    options: any;
    instance?: any;
}

interface Map {
    options: any;
    instance?: any;
}

@Component({
    templateUrl: './phenology.component.html',
    styleUrls: ['./phenology.component.scss']
})
export class PhenologyComponent extends NgxgRequest implements OnInit {

    public field: Field;
    public tabLoading: Boolean;

    public charts: any;
    public maps: any;

    constructor(
        private tabLoadingService: TabLoadingService,
        private dataExchangeService: DataExchangeService
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

                    // Also to give some time for the browser to render charts before laod data
                    // this.loadData();
                });

            }
        );

    }

    private loadData(): void {

        const display = this.field.app.season.display;

        const pDate = moment(this.field.app.season[display].plantingDate, 'YYYY-MM-DD');
        const hDate = moment(this.field.app.season[display].modelHarvestingDate, 'YYYY-MM-DD');

        // console.log(this.field.app.season[display], pDate, hDate);

        let currentValue = hDate.utc().valueOf();
        let currentLabel = '';

        if (moment().utc().valueOf() <= hDate.utc().valueOf()) {
            currentValue = moment().utc().valueOf();
            currentLabel = 'Hoje <br>';
        } else {
            currentLabel = 'Safra Completa <br>';
        }

        this.charts.phenology.instance.xAxis[0].removePlotBand(1);
        this.charts.phenology.instance.xAxis[0].removePlotLine(1);

        this.charts.phenology.instance.xAxis[0].removePlotLine(3);

        this.charts.phenology.instance.xAxis[0].setExtremes(
            pDate.clone().subtract(5, 'days').utc().valueOf(),
            hDate.clone().add(10, 'days').utc().valueOf()
        );

        this.charts.phenology.instance.xAxis[0].addPlotBand({
            from: pDate.utc().valueOf(),
            to: currentValue,
            color: 'rgba(0,150,0,0.05)',
            zIndex: 1,
            id: 1
        });
        this.charts.phenology.instance.xAxis[0].addPlotLine({
            color: '#000',
            width: 2,
            zIndex: 9,
            value: pDate.utc().valueOf(),
            label: {
                useHTML: true,
                text: '&nbsp;&nbsp;&nbsp;<b>Plantio</b><br><b>' + pDate.format('DD/MM/YYYY') + '</b>',
                align: 'center',
                verticalAlign: 'middle',
                style: {
                    fontSize: '.8em',
                    color: '#000',
                    backgroundColor: '#FFF'
                },
                y: 0,
                x: 0,
                rotation: 0
            },
            id: 1
        });

        this.charts.phenology.instance.xAxis[0].addPlotLine({
            color: '#000',
            width: 2,
            zIndex: 9,
            value: hDate.utc().valueOf(),
            label: {
                useHTML: true,
                text: '&nbsp;&nbsp;&nbsp;<b>Colheita</b><br><b>' + hDate.format('DD/MM/YYYY') + '</b>',
                align: 'center',
                verticalAlign: 'middle',
                style: {
                    fontSize: '.8em',
                    color: '#000',
                    backgroundColor: '#FFF'
                },
                y: 0,
                x: 0,
                rotation: 0
            },
            id: 3
        });

        if (this.field.app.season[display].app.currentStage) {
            currentLabel += this.field.app.season[display].app.currentStage.stage.name;

            if (this.field.app.season[display].app.nextStage != null) {
                currentLabel += '<br><br> <br>' +
                    this.field.app.season[display].app.nextStage.stage.name + ' (' +
                    this.field.app.season[display].app.nextStage.stage.abbrv + ') <br>' +
                    this.field.app.season[display].app.nextStage.in;
            }

            this.charts.phenology.instance.xAxis[0].removePlotLine(2);
            this.charts.phenology.instance.xAxis[0].addPlotLine({
                color: 'green',
                width: 2,
                zIndex: 9,
                value: currentValue,
                label: {
                    useHTML: true,
                    text: currentLabel,
                    align: 'center',
                    style: {
                        color: 'green'
                    },
                    y: 15,
                    x: -5,
                    rotation: 0
                },
                id: 2
            });
        }

        // console.log(this.field.app.season[display].phenology.current.stages);

        this.charts.phenology.instance.series[0].setData(
            this.field.app.season[display].phenology.current.stages
                .filter(stage => stage.stage.displayed)
                .map(stage => {
                    return {
                        x: pDate.clone().add(stage.dap, 'days').utc().valueOf(),
                        text: stage.stage.description,
                        title: stage.stage.abbrv
                    };
                }), true
        );

        this.charts.phenology.instance.hideLoading();
    }

    public saveChartInstance(chart: string, instance: any): void {
        this.charts[chart].instance = instance;
        instance.showLoading('Carregando dados...');

        this.loadData();
    }

    private buildCharts(): void {

        this.charts = {
            phenology: {
                options: {
                    credits: false,
                    exporting: {
                        enabled: false
                    },

                    chart: {
                        marginBottom: 50,
                        padding: 0,
                        spacing: [0, 0, 0, 0]
                    },

                    xAxis: [{
                        type: 'datetime',
                        labels: {
                            format: '{value:%d/%m/%Y}',
                            align: 'center',
                            y: 35,
                            style: {
                                fontSize: '1.1em',
                                color: '#000'
                            }
                        },

                        minTickInterval: 30 * 24 * 3600 * 1000,

                        plotBands: [],

                        plotLines: []
                    }],

                    yAxis: [{
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        }
                    }],

                    title: {
                        text: null
                    },

                    tooltip: {
                        style: {
                            width: '250px'
                        }
                    },

                    series: [{
                        type: 'flags',
                        name: 'Phases',
                        color: '#333333',
                        shape: 'flag',
                        showInLegend: false
                    }]
                }
            } as Chart
        };
    }

}
