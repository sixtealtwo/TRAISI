import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import 'echarts-gl';

import { of as observableOf, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

	zonePopulation = [
		{
			PlanningDistrict: 'PD 1 of Toronto',
			Unexpanded: 13304,
			Expanded: 263028
		},
		{
			PlanningDistrict: 'PD 2 of Toronto',
			Unexpanded: 8887,
			Expanded: 200607
		},
		{
			PlanningDistrict: 'PD 3 of Toronto',
			Unexpanded: 10316,
			Expanded: 234531
		},
		{
			PlanningDistrict: 'PD 4 of Toronto',
			Unexpanded: 10622,
			Expanded: 233122
		},
		{
			PlanningDistrict: 'PD 5 of Toronto',
			Unexpanded: 5501,
			Expanded: 121935
		},
		{
			PlanningDistrict: 'PD 6 of Toronto',
			Unexpanded: 9918,
			Expanded: 210993
		},
		{
			PlanningDistrict: 'PD 7 of Toronto',
			Unexpanded: 3423,
			Expanded: 66335
		},
		{
			PlanningDistrict: 'PD 8 of Toronto',
			Unexpanded: 9474,
			Expanded: 197781
		},
		{
			PlanningDistrict: 'PD 9 of Toronto',
			Unexpanded: 3865,
			Expanded: 94229
		},
		{
			PlanningDistrict: 'PD 10 of Toronto',
			Unexpanded: 6414,
			Expanded: 146543
		},
		{
			PlanningDistrict: 'PD 11 of Toronto',
			Unexpanded: 9908,
			Expanded: 206713
		},
		{
			PlanningDistrict: 'PD 12 of Toronto',
			Unexpanded: 3927,
			Expanded: 80857
		},
		{
			PlanningDistrict: 'PD 13 of Toronto',
			Unexpanded: 9526,
			Expanded: 229816
		},
		{
			PlanningDistrict: 'PD 14 of Toronto',
			Unexpanded: 3124,
			Expanded: 63079
		},
		{
			PlanningDistrict: 'PD 15 of Toronto',
			Unexpanded: 3793,
			Expanded: 83791
		},
		{
			PlanningDistrict: 'PD 16 of Toronto',
			Unexpanded: 10805,
			Expanded: 238131
		},
		{
			PlanningDistrict: 'Brock',
			Unexpanded: 552,
			Expanded: 11311
		},
		{
			PlanningDistrict: 'Uxbridge',
			Unexpanded: 1079,
			Expanded: 20849
		},
		{
			PlanningDistrict: 'Scugog',
			Unexpanded: 1121,
			Expanded: 21206
		},
		{
			PlanningDistrict: 'Pickering',
			Unexpanded: 4099,
			Expanded: 90250
		},
		{
			PlanningDistrict: 'Ajax',
			Unexpanded: 5274,
			Expanded: 116815
		},
		{
			PlanningDistrict: 'Whitby',
			Unexpanded: 5823,
			Expanded: 126060
		},
		{
			PlanningDistrict: 'Oshawa',
			Unexpanded: 7475,
			Expanded: 156884
		},
		{
			PlanningDistrict: 'Clarington',
			Unexpanded: 4180,
			Expanded: 91184
		},
		{
			PlanningDistrict: 'Georgina',
			Unexpanded: 2135,
			Expanded: 45464
		},
		{
			PlanningDistrict: 'East Gwillimbury',
			Unexpanded: 1163,
			Expanded: 23869
		},
		{
			PlanningDistrict: 'Newmarket',
			Unexpanded: 3737,
			Expanded: 81848
		},
		{
			PlanningDistrict: 'Aurora',
			Unexpanded: 2528,
			Expanded: 54783
		},
		{
			PlanningDistrict: 'Richmond Hill',
			Unexpanded: 9192,
			Expanded: 192245
		},
		{
			PlanningDistrict: 'Whitchurch-Stouffville',
			Unexpanded: 1742,
			Expanded: 45076
		},
		{
			PlanningDistrict: 'Markham',
			Unexpanded: 15501,
			Expanded: 323645
		},
		{
			PlanningDistrict: 'King',
			Unexpanded: 1037,
			Expanded: 24367
		},
		{
			PlanningDistrict: 'Vaughan',
			Unexpanded: 14588,
			Expanded: 299699
		},
		{
			PlanningDistrict: 'Caledon',
			Unexpanded: 3281,
			Expanded: 65624
		},
		{
			PlanningDistrict: 'Brampton',
			Unexpanded: 26005,
			Expanded: 579327
		},
		{
			PlanningDistrict: 'Mississauga',
			Unexpanded: 32599,
			Expanded: 707195
		},
		{
			PlanningDistrict: 'Halton Hills',
			Unexpanded: 2820,
			Expanded: 60001
		},
		{
			PlanningDistrict: 'Milton',
			Unexpanded: 5349,
			Expanded: 108241
		},
		{
			PlanningDistrict: 'Oakville',
			Unexpanded: 8561,
			Expanded: 190971
		},
		{
			PlanningDistrict: 'Burlington',
			Unexpanded: 7987,
			Expanded: 180023
		},
		{
			PlanningDistrict: 'Flamborough',
			Unexpanded: 1531,
			Expanded: 42346
		},
		{
			PlanningDistrict: 'Dundas',
			Unexpanded: 672,
			Expanded: 23222
		},
		{
			PlanningDistrict: 'Ancaster',
			Unexpanded: 1023,
			Expanded: 39929
		},
		{
			PlanningDistrict: 'Glanbrook',
			Unexpanded: 761,
			Expanded: 29114
		},
		{
			PlanningDistrict: 'Stoney Creek',
			Unexpanded: 2025,
			Expanded: 67920
		},
		{
			PlanningDistrict: 'Hamilton',
			Unexpanded: 8216,
			Expanded: 322979
		},
		{
			PlanningDistrict: 'Grimsby',
			Unexpanded: 1258,
			Expanded: 27164
		},
		{
			PlanningDistrict: 'Lincoln',
			Unexpanded: 1073,
			Expanded: 22894
		},
		{
			PlanningDistrict: 'Pelham',
			Unexpanded: 753,
			Expanded: 16559
		},
		{
			PlanningDistrict: 'Niagara-on-the-Lake',
			Unexpanded: 773,
			Expanded: 16662
		},
		{
			PlanningDistrict: 'St. Catharines',
			Unexpanded: 5776,
			Expanded: 129509
		},
		{
			PlanningDistrict: 'Thorold',
			Unexpanded: 935,
			Expanded: 18378
		},
		{
			PlanningDistrict: 'Niagara Falls',
			Unexpanded: 3632,
			Expanded: 85418
		},
		{
			PlanningDistrict: 'Welland',
			Unexpanded: 2309,
			Expanded: 51424
		},
		{
			PlanningDistrict: 'Port Colbourne',
			Unexpanded: 817,
			Expanded: 17830
		},
		{
			PlanningDistrict: 'Fort Erie',
			Unexpanded: 1384,
			Expanded: 30478
		},
		{
			PlanningDistrict: 'West Lincoln',
			Unexpanded: 651,
			Expanded: 14422
		},
		{
			PlanningDistrict: 'Wainfleet',
			Unexpanded: 267,
			Expanded: 6207
		},
		{
			PlanningDistrict: 'Waterloo',
			Unexpanded: 5007,
			Expanded: 103040
		},
		{
			PlanningDistrict: 'Kitchener',
			Unexpanded: 9790,
			Expanded: 228189
		},
		{
			PlanningDistrict: 'Cambridge',
			Unexpanded: 5411,
			Expanded: 127121
		},
		{
			PlanningDistrict: 'North Dumfries',
			Unexpanded: 479,
			Expanded: 10387
		},
		{
			PlanningDistrict: 'Wilmot',
			Unexpanded: 832,
			Expanded: 20450
		},
		{
			PlanningDistrict: 'Wellesley',
			Unexpanded: 532,
			Expanded: 11131
		},
		{
			PlanningDistrict: 'Woolwich',
			Unexpanded: 1058,
			Expanded: 24155
		},
		{
			PlanningDistrict: 'Guelph City',
			Unexpanded: 5676,
			Expanded: 129404
		},
		{
			PlanningDistrict: 'Puslinch',
			Unexpanded: 336,
			Expanded: 7352
		},
		{
			PlanningDistrict: 'Guelph/Eramosa',
			Unexpanded: 615,
			Expanded: 12620
		},
		{
			PlanningDistrict: 'Centre Wellington',
			Unexpanded: 1485,
			Expanded: 27843
		},
		{
			PlanningDistrict: 'Erin',
			Unexpanded: 536,
			Expanded: 11459
		},
		{
			PlanningDistrict: 'Orangeville',
			Unexpanded: 1355,
			Expanded: 28332
		},
		{
			PlanningDistrict: 'Barrie',
			Unexpanded: 6775,
			Expanded: 138028
		},
		{
			PlanningDistrict: 'Innisfil',
			Unexpanded: 1607,
			Expanded: 36709
		},
		{
			PlanningDistrict: 'Bradford West Gwillimbury',
			Unexpanded: 1503,
			Expanded: 34668
		},
		{
			PlanningDistrict: 'New Tecumseth',
			Unexpanded: 1535,
			Expanded: 33425
		},
		{
			PlanningDistrict: 'Adjala-Tosorontio',
			Unexpanded: 473,
			Expanded: 10727
		},
		{
			PlanningDistrict: 'Essa',
			Unexpanded: 982,
			Expanded: 20255
		},
		{
			PlanningDistrict: 'Clearview',
			Unexpanded: 601,
			Expanded: 13471
		},
		{
			PlanningDistrict: 'Springwater',
			Unexpanded: 703,
			Expanded: 19170
		},
		{
			PlanningDistrict: 'Kawartha Lakes',
			Unexpanded: 3342,
			Expanded: 73420
		},
		{
			PlanningDistrict: 'Peterborough City',
			Unexpanded: 3258,
			Expanded: 78308
		},
		{
			PlanningDistrict: 'Cavan-Millbrook-North Monaghan',
			Unexpanded: 431,
			Expanded: 8488
		},
		{
			PlanningDistrict: 'Otonabee-South Monaghan',
			Unexpanded: 391,
			Expanded: 6947
		},
		{
			PlanningDistrict: 'Asphodel-Norwood',
			Unexpanded: 150,
			Expanded: 4001
		},
		{
			PlanningDistrict: 'Dummer-Douro',
			Unexpanded: 351,
			Expanded: 6802
		},
		{
			PlanningDistrict: 'Selwyn',
			Unexpanded: 781,
			Expanded: 17827
		},
		{
			PlanningDistrict: 'Brant',
			Unexpanded: 2027,
			Expanded: 36277
		},
		{
			PlanningDistrict: 'Collingwood',
			Unexpanded: 964,
			Expanded: 21635
		},
		{
			PlanningDistrict: 'Wasaga Beach',
			Unexpanded: 1085,
			Expanded: 20294
		},
		{
			PlanningDistrict: 'Tiny',
			Unexpanded: 522,
			Expanded: 12280
		},
		{
			PlanningDistrict: 'Penetangushene',
			Unexpanded: 433,
			Expanded: 8380
		},
		{
			PlanningDistrict: 'Midland',
			Unexpanded: 689,
			Expanded: 16395
		},
		{
			PlanningDistrict: 'Tay',
			Unexpanded: 477,
			Expanded: 9936
		},
		{
			PlanningDistrict: 'Oro-Medonte',
			Unexpanded: 898,
			Expanded: 20860
		},
		{
			PlanningDistrict: 'Severn',
			Unexpanded: 567,
			Expanded: 13449
		},
		{
			PlanningDistrict: 'Ramara',
			Unexpanded: 473,
			Expanded: 9806
		},
		{
			PlanningDistrict: 'Orillia',
			Unexpanded: 1351,
			Expanded: 29990
		},
		{
			PlanningDistrict: 'Mulmur',
			Unexpanded: 216,
			Expanded: 3493
		},
		{
			PlanningDistrict: 'Shelburne',
			Unexpanded: 257,
			Expanded: 7787
		},
		{
			PlanningDistrict: 'Amaranth',
			Unexpanded: 196,
			Expanded: 3794
		},
		{
			PlanningDistrict: 'Melancthon',
			Unexpanded: 97,
			Expanded: 2910
		},
		{
			PlanningDistrict: 'Mono Township',
			Unexpanded: 412,
			Expanded: 8355
		},
		{
			PlanningDistrict: 'East Luther Grand Valley',
			Unexpanded: 84,
			Expanded: 3269
		},
		{
			PlanningDistrict: 'East Garafraxa',
			Unexpanded: 332,
			Expanded: 2619
		},
		{
			PlanningDistrict: 'Brantford',
			Unexpanded: 4319,
			Expanded: 96659
		},
		{
			PlanningDistrict: 'Lakefield-Smith-Enismore',
			Unexpanded: 0,
			Expanded: 0
		}
	];

	zonePopMap = [];

	private _mapURL = 'assets/maps/tts-zones-pd.json';
	private flightURL = 'https://ecomfe.github.io/echarts-examples/public/data-gl/asset/data/flights.json';
	public mapLoaded: boolean = false;

	constructor(private http: HttpClient) {
		this.zonePopulation.forEach(zoneinfo => {
			this.zonePopMap[zoneinfo.PlanningDistrict] = zoneinfo;
		});
	}
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

			let maxpop = 0;

			let zoneInfo = [];
			geoJson.features.forEach(element => {
				/*if (this.zonePopMap[element.properties.name] === undefined) {
					console.log('Problem with ' + element.properties.name);
				}*/
				let unexpanded = 10000 * this.zonePopMap[element.properties.name].Unexpanded / element.properties.AREA;
				if (unexpanded > maxpop) {
					maxpop = unexpanded;
				}
				zoneInfo.push({ name: element.properties.name, value: unexpanded });
			});

			// update options:
			this.options = {
				tooltip: {
					formatter: `{b}`
				},
				visualMap: {
					show: false,
					min: 0,
					max: maxpop,
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
						saveAsImage: {
							pixelRatio: 5
						}
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
