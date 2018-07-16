import { Component, OnInit } from '@angular/core';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';
import { DataExchangeService } from 'src/app/shared/services/data-exchange.service';
import { takeUntil, delay } from 'rxjs/operators';
import { Field } from 'src/app/shared/types/field';
import { TabLoadingService } from 'src/app/pages/field/utils/tab-loading.service';

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
export class PhenologyComponent extends NgxgUnsubscribe implements OnInit {

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
            delay(1000),
            takeUntil(this.ngxgUnsubscribe)
        ).subscribe(
            field => {
                this.field = field;

                this.buildCharts();

                this.tabLoading = false;
                this.tabLoadingService.setLoading(false);

            }
        );

    }

    public saveChartInstance(chart: string, instance: any): void {

        this.charts[chart].instance = instance;
        instance.showLoading('Carregando dados...');

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
