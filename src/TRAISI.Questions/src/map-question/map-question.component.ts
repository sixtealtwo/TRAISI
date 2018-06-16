
import { Component, OnInit, ViewChild } from '@angular/core';
import { Result } from 'ngx-mapbox-gl/app/lib/control/geocoder-control.directive';
import { MapComponent } from 'ngx-mapbox-gl';
import { LngLatLike, MapMouseEvent } from 'mapbox-gl';
import { MapEndpointService } from '../services/mapservice.service';

@Component({
  selector: 'traisi-map-question',
  template: require('./map-question.component.html').toString(), 
  styles: [require('./map-question.component.scss').toString()]
})
export class MapQuestionComponent implements OnInit {
  readonly QUESTION_TYPE_NAME: string = 'Map Question';

  typeName: string;
	icon: string;

	public locationSearch: string;
	public markerPosition: LngLatLike = [-79.40, 43.67];
	
	@ViewChild('mapbox') mapGL: MapComponent;
	@ViewChild('geocoder') mapGeocoder: any;

  constructor(private mapEndpointService: MapEndpointService) {
    this.typeName = this.QUESTION_TYPE_NAME;
    this.icon = 'map';
		console.log('loaded');
	}
	
  ngOnInit() {
		this.configureMapSettings();
	}
	
	private configureMapSettings(): void {
		this.mapGL.zoom=[9];
		this.mapGL.minZoom=7;
		this.mapGL.center=[-79.40, 43.67];
		this.mapGL.maxBounds = [[-81.115327, 43.044575], [-78.055546, 44.634225]];
		this.mapGL.doubleClickZoom = false;
		this.locationSearch="Toronto";
	}

	public locationFound(event: {result: Result}): void {
		this.locationSearch = event['result'].place_name;
		this.markerPosition = event['result'].center;
	}

	onDragStart(event: any){

	}

	onDragEnd(event: MapMouseEvent){
		this.mapEndpointService.reverseGeocode(event.lngLat.lat, event.lngLat.lng).subscribe( result => 
			{
				this.locationSearch = result;
				this.mapGeocoder.control._inputEl.value = result;
			});
	}

	onDrag(event: MapMouseEvent){

	}

	mapClick(event: MapMouseEvent){
		if (event.lngLat) {
			this.markerPosition = event.lngLat;
			this.onDragEnd(event);
		}
	}

}
