import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxgUnsubscribe } from 'src/app/core/comm/ngxg-unsubscribe';
import { DataExchangeService } from 'src/app/shared/services/data-exchange.service';
import { takeUntil, delay } from 'rxjs/operators';
import { Field } from 'src/app/shared/types/field';
import { TabLoadingService } from 'src/app/pages/field/utils/tab-loading.service';

import * as L from 'leaflet';

interface Chart {
    options: any;
    instance?: any;
}

interface Map {
    options: any;
    instance?: any;
}

@Component({
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.scss']
})
export class WeatherComponent extends NgxgUnsubscribe implements OnInit {

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
                this.buildMaps();

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
            humidity: {
                options: {
                    chart: {
                        type: 'solidgauge',
                        height: '150px'
                    },

                    title: {
                        text: null
                    },

                    yAxis: {
                        min: 0,
                        max: 100,
                        minColor: '#467C73',
                        maxColor: '#467C73',
                        title: {
                            text: null,
                            y: 30
                        },
                        minorTickLength: 0,
                        startOnTick: true,
                        lineWidth: 0,
                        minorTickInterval: null,
                        tickWidth: 0,
                        labels: {
                            enabled: false
                        }
                    },

                    pane: {
                        center: ['50%', '100%'],
                        size: '180%',
                        startAngle: -90,
                        endAngle: 90,
                        background: {
                            backgroundColor: '#EEE',
                            innerRadius: '60%',
                            outerRadius: '100%',
                            shape: 'arc'
                        }
                    },

                    tooltip: {
                        enabled: false
                    },

                    series: [{
                        name: 'Umidade',
                        data: [20],
                        dataLabels: {
                            format: '<div style="text-align:center; margin-top:-35px;">' +
                                '<span style="font-size:25px;color: #000">{y:.0f}%</span><br/>'
                        }
                    }],

                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                y: 5,
                                borderWidth: 0,
                                useHTML: true
                            }
                        }
                    },

                    credits: {
                        enabled: false
                    },

                    exporting: {
                        enabled: false
                    }
                }
            } as Chart,

            temperature: {
                options: {
                    chart: {
                        height: '230px'
                    },
                    title: {
                        text: null
                    },
                    legend: {
                        enabled: false
                    },

                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },

                    tooltip: {
                        enabled: false
                    },

                    plotOptions: {
                        series: {
                            borderColor: null,
                            states: {
                                hover: {
                                    enabled: false
                                }
                            }
                        },
                        columnrange: {
                            pointPadding: .3,
                            dataLabels: {
                                enabled: true,
                                formatter: function () {
                                    if (this.y === this.point.high) {
                                        return 'Max. Dia <br>' + this.y + '°C';
                                    } else if (this.y === this.point.low) {
                                        return 'Min. Dia <br>' + this.y + '°C';
                                    }
                                },
                                color: 'rgba(100,100,100, 1)',
                                style: {
                                    fontSize: '1em',
                                    textOutline: 0
                                },
                            }
                        }
                    },

                    xAxis: {
                        categories: ['Temperatura'],
                        tickWidth: 0,
                        lineWidth: 0,
                        labels: {
                            enabled: false
                        }
                    },

                    yAxis: [{
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        labels: {
                            format: '{value}°C',
                            align: 'left',
                            style: {
                                color: 'rgba(255,0,0, .8)'
                            },
                            x: 0,
                            y: 0
                        },
                        title: {
                            text: null,
                        },
                        plotLines: [15]
                    }],

                    series: [{
                        name: 'MaxMin',
                        data: [],
                        type: 'columnrange',
                        color: 'rgba(200,200,200, .5)'
                    }]
                }
            } as Chart,

            isse: {
                options: {
                    chart: {
                        type: 'solidgauge',
                        height: '150px'
                    },

                    title: {
                        text: null
                    },

                    yAxis: {
                        min: 0,
                        max: 1,
                        title: {
                            text: null,
                            y: 30
                        },
                        tickInterval: 200,
                        startOnTick: true,
                        lineWidth: 0,
                        minorTickInterval: null,
                        tickWidth: 0,
                        labels: {
                            enabled: false
                        }
                    },

                    pane: {
                        center: ['50%', '100%'],
                        size: '200%',
                        startAngle: -90,
                        endAngle: 90,
                        background: {
                            backgroundColor: '#EEE',
                            innerRadius: '60%',
                            outerRadius: '100%',
                            shape: 'arc'
                        }
                    },

                    tooltip: {
                        enabled: false
                    },

                    series: [{
                        name: 'ISSE',
                        data: [{
                            color: {
                                linearGradient: [0, 0, 400, 0],
                                stops: [
                                    [0, '#90D42F'],
                                    [0.3, '#DDDF0D'],
                                    [0.55, '#DF5353']
                                ]
                            },
                            y: 0.7
                        }],
                        dataLabels: {
                            format: '<div style="text-align:center; margin-top:-35px;">' +
                                '<span style="font-size:25px;color: #000">{y}</span><br/>'
                        }
                    }],

                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                y: 5,
                                borderWidth: 0,
                                useHTML: true
                            }
                        }
                    },

                    credits: {
                        enabled: false
                    },

                    exporting: {
                        enabled: false
                    }
                }
            } as Chart,

            windRose: {
                options: {
                    credits: false,
                    exporting: false,

                    series: [{
                        data: [],
                        color: '#006600'
                    }],

                    chart: {
                        polar: true,
                        type: 'column',
                        height: 150
                    },

                    title: {
                        text: null
                    },

                    pane: {
                        center: ['50%', '50%'],
                        size: '85%'
                    },

                    legend: {
                        enabled: false
                    },

                    xAxis: {
                        min: 0,
                        max: 360,
                        type: '',
                        tickInterval: 45,
                        tickmarkPlacement: 'on',
                        // gridLineColor: 'transparent',
                        labels: {
                            formatter: function () {
                                const categories = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
                                return categories[this.value / 45];
                            }
                        }
                    },

                    yAxis: {
                        min: 0,
                        max: 1,
                        labels: {
                            enabled: false
                        }
                    },

                    tooltip: {
                        enabled: false
                    },

                    plotOptions: {
                        series: {
                            pointPlacement: 'on'
                        }
                    }
                }
            } as Chart,

            dailyObserved: {
                options: {
                    title: {
                        text: null
                    },
                    navigator: {
                        enabled: false
                    },
                    rangeSelector: {
                        inputEnabled: false,
                        allButtonsEnabled: true,
                        buttons: [{
                            type: 'all',
                            text: '365 dias'
                        }, {
                            type: 'day',
                            count: 29,
                            text: '30 dias'
                        }, {
                            type: 'day',
                            count: 6,
                            text: '7 dias',
                        }],
                        buttonTheme: {
                            width: 60
                        },
                        labelStyle: {
                        },
                        selected: 0
                    },
                    tooltip: {
                        split: false,
                        shared: true,
                        xDateFormat: '%d/%m/%Y',
                        useHTML: true,
                        headerFormat: '<span style="font-size:1em;">{point.key}</span><br>',
                        style: {
                            fontSize: '1em'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },

                    yAxis: [{
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,

                        labels: {
                            format: '{value}ºC',
                            align: 'left',
                            style: {
                                color: 'rgb(255,0,0)',
                                fontSize: '1em'
                            },
                            x: 0
                        },
                        title: {
                            text: null,
                        },
                        opposite: false
                    }, {
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        minTickInterval: 1,
                        title: {
                            text: null,
                        },
                        labels: {
                            format: '{value} mm',
                            align: 'right',
                            style: {
                                color: 'rgb(45, 89, 134)',
                                fontSize: '1em'
                            },
                            x: 0
                        }
                    }],

                    series: [{
                        name: 'Chuva',
                        data: [],
                        yAxis: 1,
                        type: 'column',
                        color: 'rgba(45, 89, 134,.7)',
                        tooltip: {
                            valueDecimals: 0,
                            valueSuffix: ' mm'
                        },
                        dataGrouping: {
                            enabled: false
                        }
                    },
                    {
                        name: 'Temperatura',
                        data: [],
                        type: 'spline',
                        color: 'rgba(255,0,0, .7)',
                        tooltip: {
                            valueDecimals: 0,
                            valueSuffix: '°C'
                        },
                        dataGrouping: {
                            enabled: false
                        }
                    }]
                }
            } as Chart,

            dailyAccumulated: {
                options: {
                    title: {
                        text: null
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            style: {
                                fontSize: '1em'
                            }
                        }
                    },
                    tooltip: {
                        crosshairs: {
                            color: 'rgb(225,225,225)',
                            dashStyle: 'solid'
                        },
                        shared: false,
                        split: true,
                        xDateFormat: '%d/%m/%Y',
                        useHTML: true,
                        headerFormat: '<span style="font-size:1em;">{point.key}</span><br>',
                        style: {
                            fontSize: '1em'
                        }
                    },
                    legend: {
                        enabled: false,
                        symbolPadding: 0,
                        symbolWidth: 0.001,
                        symbolHeight: 0.001,
                        symbolRadius: 0,
                        labelFormatter: function () {
                            if (this._i === 0) {
                                return '- ' + this.name;
                            } else {
                                return '-- ' + this.name;
                            }
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },

                    yAxis: [{
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        labels: {
                            format: '{value} mm',
                            align: 'left',
                            style: {
                                color: 'rgb(45, 89, 134)',
                                fontSize: '1em'
                            },
                            x: 5
                        },
                        title: {
                            text: 'Chuva',
                            style: {
                                fontSize: '1.2em',
                                color: 'rgb(45, 89, 134)'
                            }
                        },

                        height: '40%',
                        lineWidth: 1,
                        resize: {
                            enabled: true
                        }
                    }, {
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        labels: {
                            format: '{value} GD',
                            align: 'left',
                            style: {
                                color: 'rgb(255,96,0)',
                                fontSize: '1em'
                            },
                            x: 5
                        },
                        title: {
                            text: 'Graus-dia',
                            style: {
                                fontSize: '1.2em',
                                color: 'rgb(255,96,0)'
                            }
                        },

                        top: '55%',
                        height: '40%',
                        offset: 0,
                        lineWidth: 1
                    }],

                    series: [{
                        type: 'line',
                        data: [],
                        marker: {
                            enabled: false
                        },
                        name: 'Este ano',
                        tooltip: {
                            valueDecimals: 0,
                            valueSuffix: ' mm'
                        },
                        color: 'rgba(45, 89, 134,1)',

                        yAxis: 0
                    },

                    {
                        type: 'spline',
                        color: 'rgba(255,96,0, .7)',
                        marker: {
                            enabled: false
                        },
                        name: 'Este ano',
                        linkedTo: ':previous',
                        tooltip: {
                            valueDecimals: 0,
                            valueSuffix: ' GD'
                        },
                        data: [],
                        yAxis: 1
                    },

                    {
                        type: 'line',
                        marker: {
                            enabled: false
                        },
                        dashStyle: 'shortdash',
                        name: 'Média histórica',
                        tooltip: {
                            valueDecimals: 0,
                            valueSuffix: ' mm'
                        },
                        color: 'rgba(45, 89, 134,.5)',
                        data: [],
                        yAxis: 0
                    },

                    {
                        type: 'spline',
                        color: 'rgba(255,96,0, .3)',
                        marker: {
                            enabled: false
                        },
                        dashStyle: 'shortdash',
                        name: 'Média histórica',
                        linkedTo: ':previous',
                        tooltip: {
                            valueDecimals: 0,
                            valueSuffix: ' GD'
                        },
                        data: [],
                        yAxis: 1
                    }],
                }
            } as Chart,

            rainProbability: {
                options: {
                    chart: {
                        type: 'column',
                        height: '230px'
                    },
                    title: {
                        text: null
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:.1f}%'
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.1f}%</b><br/>'
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },

                    yAxis: [{
                        gridLineWidth: 0,
                        minorGridLineWidth: 0,
                        tickInterval: 25,
                        max: 100,
                        title: {
                            text: null
                        },

                        labels: {
                            format: '{value}%',
                            align: 'right',
                            style: {
                                color: 'rgb(85, 142, 198)'
                            },
                            x: -5
                        }
                    }],

                    series: [
                        {
                            name: 'Probabilidade de Chuva',
                            data: []
                        }
                    ]
                }
            } as Chart
        };
    }

    private buildMaps(): void {

        this.maps = {
            rainForecast: {
                options: {
                    layers: [
                        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
                    ],
                    zoom: 5,
                    center: L.latLng(46.879966, -121.726909)
                }
            }
        };

    }

}
