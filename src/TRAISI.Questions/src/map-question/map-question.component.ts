import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	OnInit,
	ViewChild,
	Inject
} from '@angular/core';
import { Result } from 'ngx-mapbox-gl/app/lib/control/geocoder-control.directive';
import { MapComponent } from 'ngx-mapbox-gl';
import { LngLatLike, MapMouseEvent } from 'mapbox-gl';
import { MapEndpointService } from '../services/mapservice.service';
import { GeoLocation } from '../models/geo-location.model';
import {
	SurveyQuestion,
	ResponseTypes,
	SurveyResponder,
	QuestionConfiguration,
	SurveyViewer,
	OnSurveyQuestionInit,
	OnVisibilityChanged,
	OnSaveResponseStatus,
	StringResponseData,
	OnOptionsLoaded,
	QuestionOption,
	LocationResponseData,
	ResponseData,
	ResponseValidationState
} from 'traisi-question-sdk';
let markerIconImage = require('./assets/default-marker.png');

@Component({
	selector: 'traisi-map-question',
	template: '' + <string>require('./map-question.component.html').toString(),
	styles: [require('./map-question.component.scss').toString()]
})
export class MapQuestionComponent extends SurveyQuestion<ResponseTypes.Location>
	implements OnInit, AfterViewInit, OnVisibilityChanged {
	public locationSearch: string;
	public markerPosition: LngLatLike = [-79.4, 43.67];

	public typeName: string;
	public icon: string;

	@ViewChild('mapbox')
	public mapGL: MapComponent;
	@ViewChild('geocoder')
	public mapGeocoder: any;
	@ViewChild('geoLocator')
	public mapGeoLocator: any;

	@ViewChild('mapMarker')
	public mapMarker: ElementRef;

	/**
	 *
	 * @param mapEndpointService
	 * @param cdRef
	 */
	constructor(
		private mapEndpointService: MapEndpointService,
		private cdRef: ChangeDetectorRef,
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer
	) {
		super();
		this.icon = 'map';
	}

	public ngOnInit(): void {
		this.configureMapSettings();

		this.mapMarker.nativeElement.src = markerIconImage;
		this.savedResponse.subscribe(this.onSavedResponseData);

		this.surveyViewerService.updateNavigationState(false);
	}

	private onSavedResponseData: (response: ResponseData<ResponseTypes.Location> | 'none') => void = (
		response: ResponseData<ResponseTypes.Location> | 'none'
	) => {
		if (response !== 'none') {
			console.log(response);
			let locationResponse = <LocationResponseData>response[0];

			this.locationSearch = locationResponse.address;
			this.markerPosition = [locationResponse.longitude, locationResponse.latitude];
			this.surveyViewerService.updateNavigationState(true);
			this.validationState.emit(ResponseValidationState.VALID);
		}
	};

	public ngAfterViewInit(): void {
		this.mapGL.load.subscribe((map: mapboxgl.MapboxOptions) => {
			this.mapGeoLocator.control.on('geolocate', e => this.userLocate(e));
		});
	}

	public locationFound(event: { result: Result }): void {
		this.locationSearch = event['result'].place_name;
		this.markerPosition = event['result'].center;
		this.validationState.emit(ResponseValidationState.VALID);
		this.surveyViewerService.updateNavigationState(true);
	}

	/**
	 *
	 * @param e
	 */
	public userLocate(e: Position): void {
		this.markerPosition = [e.coords.longitude, e.coords.latitude];
		this.mapEndpointService
			.reverseGeocode(e.coords.latitude, e.coords.longitude)
			.subscribe((result: GeoLocation) => {
				this.locationSearch = result.address;
				this.mapGeocoder.control._inputEl.value = result.address;

				this.cdRef.detectChanges();
			});
	}

	public onDragStart(event: any): void {}

	/**
	 *
	 * @param event
	 */
	public onDragEnd(event: MapMouseEvent): void {
		this.mapEndpointService.reverseGeocode(event.lngLat.lat, event.lngLat.lng).subscribe((result: GeoLocation) => {
			this.locationSearch = result.address;
			this.mapGeocoder.control._inputEl.value = result.address;

			let data: LocationResponseData = {
				latitude: event.lngLat.lat,
				longitude: event.lngLat.lng,
				address: <string>result.address
			};

			this.saveResponse(data);
			this.surveyViewerService.updateNavigationState(true);
			this.validationState.emit(ResponseValidationState.VALID);
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
	private saveResponse(data: LocationResponseData): void {
		this.response.emit(data);
	}

	/**
	 *
	 * @param event
	 */
	public onDrag(event: MapMouseEvent): void {}

	/**
	 *
	 * @param event
	 */
	public mapClick(event: MapMouseEvent): void {
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

	public onQuestionShown(): void {}
	public onQuestionHidden(): void {}
}
