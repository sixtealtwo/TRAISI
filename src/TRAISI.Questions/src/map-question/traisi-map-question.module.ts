import { NgModule, ModuleWithProviders } from '@angular/core';
import { MapQuestionComponent } from './map-question.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl/esm5/lib/ngx-mapbox-gl.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MapEndpointService } from '../services/mapservice.service';

export const ngxMapWithConfig = NgxMapboxGLModule.withConfig({
	accessToken: 'pk.eyJ1IjoiYnJlbmRhbmJlbnRpbmciLCJhIjoiY2s4Y3IwN3U3MG1obzNsczJjMGhoZWc4MiJ9.OCDfSypjueUF_gKejRr6Og'
});

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
	imports: [CommonModule, ngxMapWithConfig, HttpClientModule]
})
export default class TraisiMapQuestion {
	static forRoot(): ModuleWithProviders<TraisiMapQuestion> {
		return {
			ngModule: TraisiMapQuestion,
			providers: []
		};
	}
}
