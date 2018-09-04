import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MapComponent } from 'ngx-mapbox-gl';
import { QuestionConfigurationDefinition } from '../../../models/question-configuration-definition.model';

import { LngLatLike, MapMouseEvent } from 'mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';

@Component({
	selector: 'app-location',
	templateUrl: './location.component.html',
	styleUrls: ['./location.component.scss']
})
export class LocationFieldComponent implements OnInit, AfterViewInit {
	public id: number;
	public questionConfiguration: QuestionConfigurationDefinition;
	public markerPosition;



	@ViewChild('mapbox') mapGL: MapComponent;

	constructor(private cdRef: ChangeDetectorRef) {

	}

	ngOnInit() {
		if (this.markerPosition === undefined) {
			this.setDefaultValue();
		}
		this.configureMapSettings();
	}

	ngAfterViewInit() {
		this.mapGL.load.subscribe((map: mapboxgl.MapboxOptions) => {
			this.mapGL.mapInstance.addControl(new MapboxDraw({
				displayControlsDefault: false,
				controls: {
						polygon: true,
						trash: true
				}}));
			this.mapGL.mapInstance.on('draw.update', e => this.updateBounds(e));
			this.mapGL.mapInstance.on('draw.create', e => this.updateBounds(e));
		});
	}

	updateBounds(bounds: any) {
		console.log(bounds.features[0].geometry.coordinates[0]);
	}
	setDefaultValue() {
		let locSplit = this.questionConfiguration.defaultValue.split('|');
		let lng = +locSplit[0];
		let lat = +locSplit[1];
		this.markerPosition = {lng: lng, lat: lat};
	}

	getValue(){
		return JSON.stringify(this.markerPosition);
	}

	processPriorValue(last: string) {
		this.markerPosition = JSON.parse(last);
	}

	private configureMapSettings(): void {
		this.mapGL.zoom = [9];
		this.mapGL.minZoom = 7;
		this.mapGL.center = [this.markerPosition.lng, this.markerPosition.lat];
		this.mapGL.doubleClickZoom = false;
		this.mapGL.attributionControl = false;
	}

	mapClick(event: MapMouseEvent) {
		if (event.lngLat) {
			this.markerPosition = event.lngLat;
		}
	}
}
