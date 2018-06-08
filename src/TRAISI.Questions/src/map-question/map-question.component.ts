import { Component, OnInit, ViewChild } from '@angular/core';
import { Result } from 'ngx-mapbox-gl/app/lib/control/geocoder-control.directive';
import { MapComponent } from 'ngx-mapbox-gl';
/**
 *
 */
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
	
	@ViewChild('mapbox') mapGL: MapComponent;

  constructor() {
    this.typeName = this.QUESTION_TYPE_NAME;
    this.icon = 'map';
		console.log('loaded');
	}
	
  /**
   *
   */
  ngOnInit() {
		console.log('init');
		this.configureMapSettings();
	}
	
	private configureMapSettings(): void {
		this.mapGL.zoom=[9];
		this.mapGL.minZoom=7;
		this.mapGL.center=[-79.40, 43.67];
		this.mapGL.maxBounds = [[-81.115327, 43.044575], [-78.055546, 44.634225]];
		
	}

	public locationFound(event: {result: Result}): void {
		this.locationSearch = event['result'].place_name;
	}
}
