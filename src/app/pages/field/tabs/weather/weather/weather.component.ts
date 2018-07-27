import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgxgRequest } from 'src/app/core/comm/ngxg-request';
import { DataExchangeService } from 'src/app/shared/services/data-exchange.service';
import { takeUntil, delay, map } from 'rxjs/operators';
import { Field } from 'src/app/shared/types/field';
import { TabLoadingService } from 'src/app/pages/field/utils/tab-loading.service';

import * as L from 'leaflet';
import * as moment from 'moment';
moment.locale('pt-br');

import { AgroGISService } from 'src/app/shared/services/agrogis/agrogis.service';
import { DarkskyService } from 'src/app/shared/services/cds/darksky.service';


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
export class WeatherComponent extends NgxgRequest implements OnInit {

    public field: Field;
    public tabLoading: Boolean = true;

    public charts: any;
    public maps: any;

    public gfsMap: {
        geojson?: any;
        marker?: any;
        legend?: any;
    };

    public isseDate: String;
    public windSpeed: Number;
    public windGust: Number;
    public dewPoint: Number;
    public eto: Number;

    private todayDate: string = moment().subtract(1, 'day').format('YYYYMMDD');
    private endDate: string = this.todayDate;

    private past1Year = moment().subtract(365, 'days').format('YYYYMMDD');
    private startDate = this.past1Year;

    constructor(
        private tabLoadingService: TabLoadingService,
        private dataExchangeService: DataExchangeService,
        private agrogisService: AgroGISService,
        private darkSkyService: DarkskyService
    ) {
        super();

    }

    ngOnInit() {

        this.dataExchangeService.getField().pipe(
            // delay(1000),
            takeUntil(this.ngxgUnsubscribe)
        ).subscribe(
            field => {
                this.field = field;

                this.buildCharts();
                this.buildMaps();

                /**
                 * Timeout to avoid Error
                 * ExpressionChangedAfterItHasBeenCheckedError
                 */

                setTimeout(() => {
                    this.tabLoading = false;
                    this.tabLoadingService.setLoading(false);
                });

            }
        );

    }

    private loadChartData(): void {

        if (this.field.app.season.display != null) {

            const display = this.field.app.season.display;

            if (moment(this.field.app.season[display].plantingDate as Date).isSameOrBefore(moment().startOf('day'))) {
                this.startDate = moment(this.field.app.season[display].plantingDate as Date).format('YYYYMMDD');
            }

            if (this.field.app.season[display].phenology != null) {
                this.endDate = moment(this.field.app.season[display].phenology.current.harvestingDate as Date).format('YYYYMMDD');
            } else {
                this.endDate = moment(this.field.app.season[display].harvestingDate as Date).format('YYYYMMDD');
            }

        } else {
            this.startDate = moment().startOf('year').format('YYYYMMDD');
            this.endDate = this.todayDate;
        }

        /*
         * Observed and accumulated charts
         *
         */

        this.dailyObservedAndAccumulated();

        /**
         * Arid and ETO
         *
         */

        this.aridEto();

        /*
         * Dark Sky Forecast
         *
         */

        this.darkSkyRealTimeForecast();
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
                        data: [],
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

        this.loadChartData();
    }

    private buildMaps(): void {

        this.gfsMap = this.gfsMap ? this.gfsMap : {};
        this.gfsMap.marker = {
            className: '',
            iconAnchor: [12, 41],
            html: '<img src="assets/img/mkr.png" width="25px" height="41px" />'
        };

        /**
         * GFS Forecast
         */

        this.agrogisService.getGeoJSONColor('totR').subscribe(
            result => {

                this.gfsMap = this.gfsMap ? this.gfsMap : {};
                this.gfsMap.legend = [];

                Object.keys(result[0].color_map).forEach(key => {
                    this.gfsMap.legend.push({
                        color: result[0].color_map[key],
                        ...result[0].range_map[key]
                    });
                });

                this.gfsMap.legend = this.gfsMap.legend.reverse();

            },
            error => this.setError(error));


        this.agrogisService
            .getGeoJSON('forecast',
                this.field.location.geoid.substr(0, 4),
                moment().format('YYYYMMDD'),
                moment().add(7, 'days').format('YYYYMMDD'), 'totR', 'gfs', 'ensoag')
            .subscribe(
                result => {
                    this.gfsMap = this.gfsMap ? this.gfsMap : {};
                    this.gfsMap.geojson = result;
                },
                error => this.setError(error));


    }

    /**
     * Chart Data
     *
     */

    private dailyObservedAndAccumulated() {
        this.agrogisService
            .getDailyValue('observed', this.field.location, this.past1Year, this.todayDate, 'avgT', 'v1', 1, 'cfsr')
            .pipe(takeUntil(this.ngxgUnsubscribe), map(result => this.formatHighChartData(result)))
            .subscribe(result => {
                if (result === null) {
                    this.charts.dailyObserved.instance.showLoading('Dado não disponível.');
                } else {
                    this.charts.dailyObserved.instance.series[1].setData(result);
                    this.charts.dailyObserved.instance.hideLoading();
                }
            }, error => this.setError(error));
        this.agrogisService
            .getDailyValue('observed', this.field.location, this.past1Year, this.todayDate, 'totR', 'v05b', 1, 'gpm')
            .pipe(takeUntil(this.ngxgUnsubscribe), map(result => this.formatHighChartData(result)))
            .subscribe(result => {
                if (result === null) {
                    this.charts.dailyObserved.instance.showLoading('Dado não disponível.');
                } else {
                    this.charts.dailyObserved.instance.series[0].setData(result.map(res => [res[0], Math.round(res[1])]));
                    this.charts.dailyObserved.instance.hideLoading();
                    result = result.filter(res => res[0] >= moment(this.startDate.toString(), 'YYYYMMDD').valueOf() &&
                        res[0] <= moment(this.endDate.toString(), 'YYYYMMDD').valueOf());
                    this.charts.dailyAccumulated.instance.series[0].setData(this.getAccumulation(result));
                    this.charts.dailyAccumulated.instance.series[0]
                        .update({ name: (!this.field.app.season.display) ? 'Desde 1º de Janeiro' : 'Esta safra' });
                }
            }, error => this.setError(error));
        this.agrogisService
            .getDailyValue('observed', this.field.location, this.startDate, this.endDate, 'gdd', 'v1', 2, 'ensoag')
            .pipe(takeUntil(this.ngxgUnsubscribe), map(result => this.formatHighChartData(result)))
            .subscribe(result => {
                if (result === null) {
                    this.charts.dailyAccumulated.instance.showLoading('Dado não disponível.');
                } else {
                    result = result.filter(res => res[0] >= moment(this.startDate.toString(), 'YYYYMMDD').valueOf());
                    this.charts.dailyAccumulated.instance.series[1].setData(this.getAccumulation(result));
                    this.charts.dailyAccumulated.instance.series[1]
                        .update({ name: (!this.field.app.season.display) ? 'Desde 1º de Janeiro' : 'Esta safra' });
                    this.charts.dailyAccumulated.instance.hideLoading();
                }
            }, error => this.setError(error));
        /**
         * Accumulated Historical
         *
         */
        this.agrogisService.getDailyValue('historical', this.field.location, this.startDate, this.endDate, 'totR', 'v2', 1, 'ensoag')
            .pipe(takeUntil(this.ngxgUnsubscribe), map(result => this.formatHighChartData(result)))
            .subscribe(result => {
                if (result === null) {
                    this.charts.dailyAccumulated.instance.showLoading('Dado não disponível.');
                } else {
                    result.sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0); });
                    result = result.filter(res => res[0] >= moment(this.startDate.toString(), 'YYYYMMDD').valueOf());
                    this.charts.dailyAccumulated.instance.series[2].setData(this.getAccumulation(result));
                    this.charts.dailyAccumulated.instance.hideLoading();
                }
            }, error => this.setError(error));
        this.agrogisService.getDailyValue('historical', this.field.location, this.startDate, this.endDate, 'gdd', 'v1', 2, 'ensoag')
            .pipe(takeUntil(this.ngxgUnsubscribe), map(result => this.formatHighChartData(result)))
            .subscribe(result => {
                if (result === null) {
                    this.charts.dailyAccumulated.instance.showLoading('Dado não disponível.');
                } else {
                    result.sort(function (a, b) { return (a[0] > b[0]) ? 1 : ((b[0] > a[0]) ? -1 : 0); });
                    result = result.filter(res => res[0] >= moment(this.startDate.toString(), 'YYYYMMDD').valueOf());
                    this.charts.dailyAccumulated.instance.series[3].setData(this.getAccumulation(result));
                    this.charts.dailyAccumulated.instance.hideLoading();
                }
            }, error => this.setError(error));
    }

    private darkSkyRealTimeForecast() {
        this.darkSkyService.getDarkSkyCDS(this.field._id, this.field.location)
            .pipe(takeUntil(this.ngxgUnsubscribe), map(result => result.data.darkSky))
            .subscribe(result => {
                if (result !== null) {
                    this.charts.windRose.instance.series[0].setData([[result.currently.windBearing, 1]]);
                    this.windSpeed = Math.round(result.currently.windSpeed);
                    this.windGust = Math.round(result.currently.windGust);
                    this.charts.windRose.instance.hideLoading();
                    this.charts.temperature.instance.series[0]
                        .setData([[Math.round(result.daily.data[0].temperatureMin), Math.round(result.daily.data[0].temperatureMax)]]);
                    this.charts.temperature.instance.yAxis[0].addPlotLine({
                        zIndex: 5,
                        value: Math.round(result.currently.temperature),
                        color: 'rgba(255,0,0,.1)',
                        dashStyle: 'solid',
                        width: 2,
                        label: {
                            useHTML: false,
                            text: Math.round(result.currently.temperature) + '°C' + '<br> <span style="font-size:.7em;">Agora</span>',
                            align: 'right',
                            x: 0,
                            style: {
                                color: 'rgba(0,0,0,1)',
                                fontSize: '1.8em',
                                fontWeight: 'bold'
                            }
                        }
                    });
                    this.charts.temperature.instance.hideLoading();
                    this.charts.humidity.instance.series[0].addPoint([Math.round(result.currently.humidity * 100)]);
                    this.charts.humidity.instance.hideLoading();
                    this.dewPoint = Math.round(result.currently.dewPoint);
                    this.charts.rainProbability.instance.xAxis[0].setCategories([
                        moment.unix(result.daily.data[0].time).utc().format('DD/MM') + ' (Hoje)',
                        moment.unix(result.daily.data[1].time).utc().format('DD/MM'),
                        moment.unix(result.daily.data[2].time).utc().format('DD/MM'),
                        moment.unix(result.daily.data[3].time).utc().format('DD/MM')
                    ]);
                    this.charts.rainProbability.instance.series[0].setData([
                        result.daily.data[0].precipProbability * 100,
                        result.daily.data[1].precipProbability * 100,
                        result.daily.data[2].precipProbability * 100,
                        result.daily.data[3].precipProbability * 100
                    ]);
                    this.charts.rainProbability.instance.hideLoading();
                } else {
                    this.charts.windRose.instance.showLoading('Dado não disponível');
                    this.charts.temperature.instance.showLoading('Dado não disponível');
                    this.charts.humidity.instance.showLoading('Dado não disponível');
                    this.charts.rainProbability.instance.showLoading('Dado não disponível');
                }
            }, error => this.setError(error));
    }

    private aridEto() {
        this.agrogisService
            .getDailyValue('observed', this.field.location,
                moment().subtract(10, 'days').format('YYYYMMDD'), moment().format('YYYYMMDD'), 'arid', 'v3', 1, 'ensoag')
            .subscribe(result => {
                if (result === null) {
                    this.charts.isse.instance.showLoading('Dado não disponível.');
                } else {
                    const arid = (result.reduce(function (max, x) {
                        return (moment(x.date, 'YYYY-MM-DD').valueOf() > moment(max.date, 'YYYY-MM-DD').valueOf()) ? x : max;
                    }, result[0]));
                    this.isseDate = (moment(arid.date, 'YYYY-MM-DD').isSame(moment().subtract(1, 'day').startOf('day'))) ?
                        'Ontem' : 'em ' + moment(arid.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
                    this.charts.isse.instance.series[0].points[0].update(parseFloat(arid.value.toFixed(2)));
                    this.charts.isse.instance.hideLoading();
                }
            }, error => this.setError(error));
        this.agrogisService
            .getDailyValue('observed', this.field.location,
                moment().subtract(10, 'days').format('YYYYMMDD'), moment().format('YYYYMMDD'), 'eto', 'v3', 1, 'ensoag')
            .subscribe(result => {
                if (result !== null) {
                    const eto = (result.reduce(function (max, x) {
                        return (moment(x.date, 'YYYY-MM-DD').valueOf() > moment(max.date, 'YYYY-MM-DD').valueOf()) ? x : max;
                    }, result[0]));
                    this.eto = Math.round(eto.value);
                }
            }, error => this.setError(error));
    }


    /**
     * Chart Utils
     *
     */

    public saveChartInstance(chart: string, instance: any): void {

        this.charts[chart].instance = instance;
        instance.showLoading('Carregando dados...');

    }

    private formatHighChartData(data): Array<any> {
        return data.map(res => {
            return [
                moment(res.date, 'YYYY-MM-DD').valueOf(),
                res.value
            ];
        });
    }

    private getAccumulation(data) {
        const totalList = [];
        let total = 0;

        for (let i = 0; i < data.length; i++) {
            total += data[i][1];
            totalList.push([data[i][0], total]);
        }

        return totalList;
    }

}
