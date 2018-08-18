import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';

import { of as observableOf, Observable, Subject } from 'rxjs';
import { HttpClient } from '../../../node_modules/@angular/common/http';

@Component({
	selector: 'app-dashboard',
	styleUrls: ['./dashboard.component.scss'],
	templateUrl: './dashboard.template.html'
})
export class DashboardComponent implements OnInit {
	options = {};
	echartsInstance: any;

	private _mapURL = 'assets/maps/tts-zones.json';
	public mapLoaded: boolean = false;

	constructor(private http: HttpClient) {}
	getMapData(): Observable<any> {
		return this.http.get(this._mapURL);
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
			let nameMap = [];
			geoJson.features.forEach(element => {
				zoneInfo.push({name: 'Zone ' + element.properties.name, value: randomValue() });
				nameMap[element.properties.name] = 'Zone ' + element.properties.name;
			});
		
			// update options:
			this.options = {
				tooltip: {},
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
				geo: {
					map: 'TTS',
					roam: true,
					nameMap: nameMap,
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
							areaColor: null,
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
	}

	onChartInit(ec) {
		this.echartsInstance = ec;
	}
}
