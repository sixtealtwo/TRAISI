import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MapComponent } from 'ngx-mapbox-gl';
import { QuestionConfigurationDefinition } from '../../../models/question-configuration-definition.model';

import { LngLatLike, MapMouseEvent } from 'mapbox-gl';

@Component({
	selector: 'app-location',
	templateUrl: './location.component.html',
	styleUrls: ['./location.component.scss']
})
export class LocationFieldComponent implements OnInit {
	public id: number;
	public questionConfiguration: QuestionConfigurationDefinition;
	public markerPosition = {lng: -79.4, lat: 43.67};

	@ViewChild('mapbox') mapGL: MapComponent;

	constructor(private cdRef: ChangeDetectorRef) {

	}

	ngOnInit() {
		this.configureMapSettings();
	}


	getValue(){
		return JSON.stringify({position: this.markerPosition});
	}

	private configureMapSettings(): void {
		this.mapGL.zoom = [9];
		this.mapGL.minZoom = 7;
		this.mapGL.center = [-79.4, 43.67];
		this.mapGL.maxBounds = [[-81.115327, 43.044575], [-78.055546, 44.634225]];
		this.mapGL.doubleClickZoom = false;
		this.mapGL.attributionControl = false;

	}

	mapClick(event: MapMouseEvent) {
		if (event.lngLat) {
			this.markerPosition = event.lngLat;
		}
	}
}
