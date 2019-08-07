import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LngLatLike, MapMouseEvent, Marker, LngLat } from 'mapbox-gl';
import { MapComponent } from 'ngx-mapbox-gl';
import { Result } from 'ngx-mapbox-gl/lib/control/geocoder-control.directive';
import { ReplaySubject } from 'rxjs';
import {
	LocationResponseData, OnVisibilityChanged, ResponseData,
	ResponseTypes, ResponseValidationState, SurveyQuestion, SurveyViewer
} from 'traisi-question-sdk';
import { GeoLocation } from '../models/geo-location.model';
import { MapEndpointService } from '../services/mapservice.service';
import templateString from './map-question.component.html';
@Component({
	selector: 'traisi-map-question',
	template: '' + <string>templateString,
	encapsulation: ViewEncapsulation.None,
	styles: [require('./map-question.component.scss').toString()]
})
export class MapQuestionComponent extends SurveyQuestion<ResponseTypes.Location> implements OnInit, AfterViewInit, OnVisibilityChanged {
	public locationSearch: string;
	public locationLoaded: boolean = false;

	/**
	 * Purpose  of map question component
	 */
	public purpose: string = '';

	private _markerPosition: number[] = [-79.4, 43.67];

	private _defaultPosition: number[] = [-79.4, 43.67];

	/**
	 * Gets marker position
	 */
	public get markerPosition(): number[] {
		return this._markerPosition;
	}

	/**
	 * Sets marker position
	 */
	public set markerPosition(val: number[]) {
		if (val !== undefined) {
			this.locationLoaded = true;
		} else {
			this.locationLoaded = false;
		}

		this._markerPosition = val;
	}

	/**
	 * Gets marker icon
	 */
	public get markerIcon(): string {
		switch (this.purpose) {
			case 'home':
				return 'fas fa-home';
			case 'work':
				return 'fas fa-building';
			case 'school':
				return 'fas fa-school';
			case 'daycare':
				return 'fas fa-child';
			case 'shopping':
				return 'fas fa-shopping-cart';
			case 'facilitate passenger':
				return 'fas fa-car-side';
			case 'other':
				return 'fas fa-location-arrow';
			default:
				return '';
		}
	}

	@ViewChild('mapbox')
	public mapGL: MapComponent;
	@ViewChild('geocoder')
	public mapGeocoder: any;
	@ViewChild('geoLocator')
	public mapGeoLocator: any;

	@ViewChild('mapMarker')
	public mapMarker: ElementRef;

	private _mapinstance: mapboxgl.Map;
	public mapInstance: ReplaySubject<mapboxgl.Map>;

	/**
	 * Creates an instance of map question component.
	 * @param mapEndpointService
	 * @param cdRef
	 * @param surveyViewerService
	 */
	constructor(
		private mapEndpointService: MapEndpointService,
		private cdRef: ChangeDetectorRef,
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer
	) {
		super();

		this.mapInstance = new ReplaySubject<mapboxgl.Map>(1);

		// this.displayClass = 'view-full';
	}

	/**
	 * Flys to position
	 * @param val
	 */
	private flyToPosition(val: number[], zoomLevel?: number): void {
		let obj: mapboxgl.FlyToOptions;

		this.markerPosition = val;
		if (this._mapinstance !== undefined) {
			if (!zoomLevel) {
				zoomLevel = this._mapinstance.getZoom();
			}
			this._mapinstance.flyTo({
				center: new LngLat(val[0], val[1]),
				animate: true,
				duration: 2000,
				zoom: zoomLevel
			});
		}
	}

	/**
	 * on init
	 */
	public ngOnInit(): void {
		this.configureMapSettings();
		// this.mapMarker.nativeElement.src = markerIconImage;
		this.savedResponse.subscribe(this.onSavedResponseData);
		this.surveyViewerService.updateNavigationState(false);
	}

	/**
	 * Called when response data is ready
	 */
	private onSavedResponseData: (response: ResponseData<ResponseTypes.Location> | 'none') => void = (
		response: ResponseData<ResponseTypes.Location> | 'none'
	) => {
		if (response !== 'none') {
			let locationResponse = <LocationResponseData>response[0];

			this.locationSearch = locationResponse.address;
			this.mapGeocoder.control._inputEl.value = locationResponse.address;
			this.markerPosition = [locationResponse.longitude, locationResponse.latitude];
			this.surveyViewerService.updateNavigationState(true);
			this.validationState.emit(ResponseValidationState.VALID);
		}
	};

	/**
	 * after view init
	 */
	public ngAfterViewInit(): void {
		this.mapGL.load.subscribe((map: mapboxgl.MapboxOptions) => {
			this.mapGeoLocator.control.on('geolocate', e => this.userLocate(e));
			this._mapinstance = this.mapGL.mapInstance;
			this.mapInstance.next(this.mapGL.mapInstance);
			this.mapGL.mapInstance.resize();
			this.mapGL.mapInstance.once('moveend', e => {
				setTimeout(() => {
					this.mapGeocoder.control._inputEl.focus();
				}, 1000);
			});
			this.flyToPosition(this.markerPosition, 12);
		});
	}

	/**
	 * Locations found
	 * @param event
	 */
	public locationFound(event: { result: Result }): void {
		if (this.markerPosition !== event['result'].center) {
			this.locationSearch = event['result'].place_name;
			this.markerPosition = event['result'].center;

			let data: LocationResponseData = {
				latitude: this.markerPosition[1],
				longitude: this.markerPosition[0],
				address: event['result'].place_name
			};

			this.saveResponse(data);
			this.validationState.emit(ResponseValidationState.VALID);
			this.surveyViewerService.updateNavigationState(true);
			this.autoAdvance.emit(2000);
		}
	}

	/**
	 * Sets question state
	 * @param latitude
	 * @param longitude
	 * @param location
	 */
	public setQuestionState(latitude: number, longitude: number, address: string): void {
		this.locationSearch = address;
		this.mapGeocoder.control._inputEl.value = address;
		this.markerPosition = [longitude, latitude];
		this.flyToPosition([longitude, latitude]);
		this.locationLoaded = true;
	}

	/**
	 *
	 * @param e
	 */
	public userLocate(e: Position): void {
		this.markerPosition = [e.coords.longitude, e.coords.latitude];
		this.mapEndpointService.reverseGeocode(e.coords.latitude, e.coords.longitude).subscribe((result: GeoLocation) => {
			this.locationSearch = result.address;
			this.mapGeocoder.control._inputEl.value = result.address;

			this.cdRef.detectChanges();

			let data: LocationResponseData = {
				latitude: e.coords.latitude,
				longitude: e.coords.longitude,
				address: <string>result.address
			};

			this.saveResponse(data);
			this.surveyViewerService.updateNavigationState(true);
			this.validationState.emit(ResponseValidationState.VALID);
		});
	}

	/**
	 * Determines whether drag start on
	 * @param event
	 */
	public onDragStart(event: any): void { }

	/**
	 *
	 * @param event
	 */
	public onDragEnd(event: Marker): void {
		this.flyToPosition(event.getLngLat().toArray());
		this.mapEndpointService.reverseGeocode(event.getLngLat().lat, event.getLngLat().lng).subscribe((result: GeoLocation) => {
			this.locationSearch = result.address;
			this.mapGeocoder.control._inputEl.value = result.address;

			let data: LocationResponseData = {
				latitude: event.getLngLat().lat,
				longitude: event.getLngLat().lng,
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
	public onDrag(event: MapMouseEvent): void { }

	/**
	 *
	 * @param event
	 */
	public mapClick(event: MapMouseEvent): void {
		if (event.lngLat) {
			this.markerPosition = event.lngLat.toArray();
			let marker: Marker = new Marker();
			marker.setLngLat(event.lngLat);
			this.onDragEnd(marker);
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
	}

	/**
	 * Determines whether question shown on
	 */
	public onQuestionShown(): void {
		this.mapInstance.subscribe(instance => {
			// instance.resize();
		});
	}

	/**
	 * Determines whether question hidden on
	 */
	public onQuestionHidden(): void { }

	/**
	 * Loads configuration
	 * @param mapConfig
	 */
	public loadConfiguration(mapConfig: any): void {
		let purpose = JSON.parse(mapConfig.purpose);

		this.purpose = purpose.id;
	}

	public resetInput(): void {
		this.mapGeocoder.control._inputEl.value = '';
		this.locationSearch = '';
	}

	public clearLocation(): void {
		this.resetInput();
		this.validationState.emit(ResponseValidationState.INVALID);
		this.flyToPosition(this._defaultPosition);
	}
}
