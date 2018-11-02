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
		NgxMapboxGLModule.withConfig({
			accessToken:
				// tslint:disable-next-line:max-line-length
				'pk.eyJ1IjoiYnJlbmRhbmJlbnRpbmciLCJhIjoiY2oyOTlwdjNjMDB5cTMzcXFsdmRyM3NnNCJ9.NXgWTnWfvGRnNgkWdd5wKg'
				// Can also be set per map (accessToken input of mgl-map)

		}),
		HttpClientModule
	]
})
export default class TraisiQuestions {}
