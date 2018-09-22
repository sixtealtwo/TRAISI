import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	OnInit,
	ViewChild
} from '@angular/core';
import { Result } from 'ngx-mapbox-gl/app/lib/control/geocoder-control.directive';
import { MapComponent } from 'ngx-mapbox-gl';
import { LngLatLike, MapMouseEvent } from 'mapbox-gl';
import { MapEndpointService } from '../services/mapservice.service';
import { GeoLocation } from '../models/geo-location.model';
import { QuestionResponseState, TRAISI } from 'traisi-question-sdk';

let markerIconImage = require('./assets/default-marker.png');

@Component({
	selector: 'traisi-map-question',
	template: require('./map-question.component.html').toString(),
	styles: [require('./map-question.component.scss').toString()]
})
export class MapQuestionComponent extends TRAISI.SurveyQuestion<TRAISI.ResponseTypes.Location>
	implements OnInit, AfterViewInit {
	readonly QUESTION_TYPE_NAME: string = 'Location Question';

	public locationSearch: string;
	public markerPosition: LngLatLike = [-79.4, 43.67];

	public typeName: string;
	public icon: string;

	@ViewChild('mapbox')
	mapGL: MapComponent;
	@ViewChild('geocoder')
	mapGeocoder: any;
	@ViewChild('geoLocator')
	mapGeoLocator: any;

	@ViewChild('mapMarker')
	mapMarker: ElementRef;

	/**
	 *
	 * @param mapEndpointService
	 * @param cdRef
	 */
	constructor(private mapEndpointService: MapEndpointService, private cdRef: ChangeDetectorRef) {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'map';
	}

	ngOnInit() {
		this.configureMapSettings();

		this.mapMarker.nativeElement.src = markerIconImage;
	}

	ngAfterViewInit() {
		this.mapGL.load.subscribe((map: mapboxgl.MapboxOptions) => {
			this.mapGeoLocator.control.on('geolocate', e => this.userLocate(e));
		});
	}

	/**
	 *
	 * @param event
	 */
	public locationFound(event: { result: Result }): void {
		this.locationSearch = event['result'].place_name;
		this.markerPosition = event['result'].center;

		console.log(event);
	}

	/**
	 *
	 * @param e
	 */
	userLocate(e: Position) {
		this.markerPosition = [e.coords.longitude, e.coords.latitude];
		this.mapEndpointService
			.reverseGeocode(e.coords.latitude, e.coords.longitude)
			.subscribe((result: GeoLocation) => {
				this.locationSearch = result.address;
				this.mapGeocoder.control._inputEl.value = result.address;

	

				this.cdRef.detectChanges();

	
			});
	}

	onDragStart(event: any) {}

	/**
	 *
	 * @param event
	 */
	onDragEnd(event: MapMouseEvent) {
		this.mapEndpointService.reverseGeocode(event.lngLat.lat, event.lngLat.lng).subscribe((result: GeoLocation) => {
			this.locationSearch = result.address;
			this.mapGeocoder.control._inputEl.value = result.address;

			let data: TRAISI.LocationResponseData = {
				latitude: event.lngLat.lat,
				longitude: event.lngLat.lng,
				address: <string>result.address
			};

			console.log('Sending ' + data);
			this.saveResponse(data);

		});
	}

	/**
	 * Save the response to the response handler
	 *
	 * @private
	 * @param {*} coords
	 * @param {*} address
	 * @memberof MapQuestionComponent
	 */
	private saveResponse(data: TRAISI.LocationResponseData) {
		this.response.emit(data);
	}

	/**
	 *
	 * @param event
	 */
	onDrag(event: MapMouseEvent) {}

	/**
	 *
	 * @param event
	 */
	mapClick(event: MapMouseEvent) {
		if (event.lngLat) {
			this.markerPosition = event.lngLat;
			this.onDragEnd(event);


		}
	}

	/**
	 *
	 */
	private configureMapSettings(): void {
		this.mapGL.zoom = [9];
		this.mapGL.minZoom = 7;
		this.mapGL.center = [-79.4, 43.67];
		this.mapGL.maxBounds = [[-81.115327, 43.044575], [-78.055546, 44.634225]];
		this.mapGL.doubleClickZoom = false;
		this.mapGL.attributionControl = false;

		this.locationSearch = 'Toronto';
	}
}
