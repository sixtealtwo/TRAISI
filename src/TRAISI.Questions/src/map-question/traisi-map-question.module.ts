import { NgModule } from '@angular/core';
import { MapQuestionComponent } from './map-question.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { MapEndpointService } from '../services/mapservice.service';

@NgModule({
	declarations: [MapQuestionComponent],
	entryComponents: [MapQuestionComponent],
	providers: [
		{
			provide: 'widgets',
			useValue: [
				{
					name: 'traisi-map-question',
					id: 'location',
					component: MapQuestionComponent
				}
			],
			multi: true
		},
		MapEndpointService
	],
	imports: [
		CommonModule,
		NgxMapboxGLModule.forRoot({
			accessToken:
				// tslint:disable-next-line:max-line-length
				'pk.eyJ1IjoiYnJlbmRhbmJlbnRpbmciLCJhIjoiY2oyOTlwdjNjMDB5cTMzcXFsdmRyM3NnNCJ9.NXgWTnWfvGRnNgkWdd5wKg' // Can also be set per map (accessToken input of mgl-map)
			// geocoderAccessToken: 'TOKEN' // Optionnal, specify if different from the map access token, can also be set per mgl-geocoder (accessToken input of mgl-geocoder)
		}),
		HttpClientModule
	]
})
export default class TraisiQuestions {}
