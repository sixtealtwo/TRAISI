import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import 'echarts-gl';

import { of as observableOf, Observable, Subject } from 'rxjs';
import { HttpClient } from '../../../node_modules/@angular/common/http';

@Component({
	selector: 'app-dashboard',
	styleUrls: ['./dashboard.component.scss'],
	templateUrl: './dashboard.template.html'
})
export class DashboardComponent implements OnInit {
	options = {};
	options2 = {};
	echartsInitOptions = {
		renderer: 'canvas'
	};
	echartsInstance: any;

	private _mapURL = 'assets/maps/tts-zones-pd.json';
	private flightURL = 'https://ecomfe.github.io/echarts-examples/public/data-gl/asset/data/flights.json';
	public mapLoaded: boolean = false;

	constructor(private http: HttpClient) {}
	getMapData(): Observable<any> {
		return this.http.get(this._mapURL);
	}

	getFlightData(): Observable<any> {
		return this.http.get(this.flightURL);
	}

	ngOnInit() {
		this.getMapData().subscribe(geoJson => {
			this.mapLoaded = true;
			// register map:
			echarts.registerMap('TTS', geoJson);

			function randomValue() {
				return Math.round(Math.random() * 8000);
			}

			let zoneInfo = [];
			geoJson.features.forEach(element => {
				zoneInfo.push({ name: element.properties.name, value: randomValue() });
			});

			// update options:
			this.options = {
				tooltip: {
					formatter: `{b}`
				},
				visualMap: {
					min: 0,
					max: 9000,
					left: 'left',
					top: 'bottom',
					text: ['High', 'Low'],
					seriesIndex: [0],
					inRange: {
						color: ['#e0ffff', '#ff0000'],
						colorAlpha: 0.3
					},
					calculable: true
				},
				toolbox: {
					show: true,
					orient: 'vertical',
					top: 'center',
					right: '20px',
					z: 20,
					zlevel: 20,
					feature: {
						dataView: {
							readOnly: true,
							title: 'data view'
						},
						saveAsImage: {}
					}
				},
				geo: {
					map: 'TTS',
					roam: true,
					label: {
						emphasis: {
							textStyle: {
								color: '#fff'
							},
							show: false
						}
					},
					itemStyle: {
						normal: {
							borderColor: 'rgba(0, 0, 0, 0.2)'
						},
						emphasis: {
							areaColor: '#ff0000',
							shadowOffsetX: 0,
							shadowOffsetY: 0,
							shadowBlur: 20,
							borderWidth: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				},
				series: [
					{
						name: 'TTS Zone',
						type: 'map',
						geoIndex: 0,
						// tooltip: {show: false},
						data: zoneInfo
					}
				]
			};
		});

		this.getFlightData().subscribe(data => {
			let airports = data.airports.map(function(item) {
				return {
					coord: [item[3], item[4]]
				};
			});
			function getAirportCoord(idx) {
				return [data.airports[idx][3], data.airports[idx][4]];
			}

			// Route: [airlineIndex, sourceAirportIndex, destinationAirportIndex]
			let routesGroupByAirline = {};
			data.routes.forEach(function(route) {
				let airline = data.airlines[route[0]];
				let airlineName = airline[0];
				if (!routesGroupByAirline[airlineName]) {
					routesGroupByAirline[airlineName] = [];
				}
				routesGroupByAirline[airlineName].push(route);
			});

			let pointsData = [];
			data.routes.forEach(function(airline) {
				pointsData.push(getAirportCoord(airline[1]));
				pointsData.push(getAirportCoord(airline[2]));
			});

			let series = data.airlines
				.map(function(airline) {
					let airlineName = airline[0];
					let routes = routesGroupByAirline[airlineName];

					if (!routes) {
						return null;
					}
					return {
						type: 'lines3D',
						name: airlineName,

						effect: {
							show: true,
							trailWidth: 2,
							trailLength: 0.15,
							trailOpacity: 1,
							trailColor: 'rgb(30, 30, 60)'
						},

						lineStyle: {
							width: 1,
							color: 'rgb(50, 50, 150)',
							// color: 'rgb(118, 233, 241)',
							opacity: 0.1
						},
						blendMode: 'lighter',

						data: routes.map(function(item) {
							return [airports[item[1]].coord, airports[item[2]].coord];
						})
					};
				})
				.filter(function(series) {
					return !!series;
				});
			series.push({
				type: 'scatter3D',
				coordinateSystem: 'globe',
				blendMode: 'lighter',
				symbolSize: 2,
				itemStyle: {
					color: 'rgb(50, 50, 150)',
					opacity: 0.2
				},
				data: pointsData
			});

			this.options2 = {
				legend: {
					selectedMode: 'single',
					left: 'left',
					data: Object.keys(routesGroupByAirline),
					orient: 'vertical',
					textStyle: {
						color: '#fff'
					}
				},
				globe: {
					environment: 'assets/maps/globe-assets/starfield.jpg',

					heightTexture: 'assets/maps/globe-assets/bathymetry_bw_composite_4k.jpg',

					displacementScale: 0.1,
					displacementQuality: 'high',

					baseColor: '#000',

					shading: 'realistic',
					realisticMaterial: {
						roughness: 0.2,
						metalness: 0
					},

					postEffect: {
						enable: true,
						depthOfField: {
							enable: false,
							focalDistance: 150
						}
					},
					temporalSuperSampling: {
						enable: true
					},
					light: {
						ambient: {
							intensity: 0
						},
						main: {
							intensity: 0.1,
							shadow: false
						},
						ambientCubemap: {
							texture: 'assets/maps/globe-assets/lake.hdr',
							exposure: 1,
							diffuseIntensity: 0.5,
							specularIntensity: 2
						}
					},
					viewControl: {
						autoRotate: false
					},
					silent: true
				},
				series: series
			};
		});
	}

	onChartInit(ec) {
		this.echartsInstance = ec;
	}
}
