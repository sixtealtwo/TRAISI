import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Result } from 'ngx-mapbox-gl/app/lib/control/geocoder-control.directive';
import { MapComponent } from 'ngx-mapbox-gl';
import { LngLatLike, MapMouseEvent } from 'mapbox-gl';
import { MapEndpointService } from '../services/mapservice.service';
import { GeoLocation } from '../models/geo-location.model';

@Component({
	selector: 'traisi-map-question',
	template: require('./map-question.component.html').toString(),
	styles: [require('./map-question.component.scss').toString()]
})
export class MapQuestionComponent implements OnInit, AfterViewInit {
	readonly QUESTION_TYPE_NAME: string = 'Map Question';

	typeName: string;
	icon: string;

	public locationSearch: string;
	public markerPosition: LngLatLike = [-79.4, 43.67];

	@ViewChild('mapbox') mapGL: MapComponent;
	@ViewChild('geocoder') mapGeocoder: any;
	@ViewChild('geoLocator') mapGeoLocator: any;

	constructor(private mapEndpointService: MapEndpointService, private cdRef: ChangeDetectorRef) {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'map';
		console.log('loaded');
	}

	ngOnInit() {
		this.configureMapSettings();
	}

	ngAfterViewInit() {
		this.mapGL.load.subscribe((map: mapboxgl.Map) => {
			this.mapGeoLocator.control.on('geolocate', e => this.userLocate(e));
		});
	}

	private configureMapSettings(): void {
		this.mapGL.zoom = [9];
		this.mapGL.minZoom = 7;
		this.mapGL.center = [-79.4, 43.67];
		this.mapGL.maxBounds = [[-81.115327, 43.044575], [-78.055546, 44.634225]];
		this.mapGL.doubleClickZoom = false;
		this.mapGL.attributionControl = false;

		this.locationSearch = 'Toronto';
	}

	public locationFound(event: { result: Result }): void {
		this.locationSearch = event['result'].place_name;
		this.markerPosition = event['result'].center;
	}

	userLocate(e: Position) {
		this.markerPosition = [e.coords.longitude, e.coords.latitude];
		this.mapEndpointService.reverseGeocode(e.coords.latitude,e.coords.longitude).subscribe((result: GeoLocation) => {
			this.locationSearch = result.address;
			this.mapGeocoder.control._inputEl.value = result.address;
			this.cdRef.detectChanges();
		});
	}

	onDragStart(event: any) {}

	onDragEnd(event: MapMouseEvent) {
		this.mapEndpointService.reverseGeocode(event.lngLat.lat, event.lngLat.lng).subscribe((result: GeoLocation) => {
			this.locationSearch = result.address;
			this.mapGeocoder.control._inputEl.value = result.address;
		});
	}

	onDrag(event: MapMouseEvent) {}

	mapClick(event: MapMouseEvent) {
		if (event.lngLat) {
			this.markerPosition = event.lngLat;
			this.onDragEnd(event);
		}
	}
}
