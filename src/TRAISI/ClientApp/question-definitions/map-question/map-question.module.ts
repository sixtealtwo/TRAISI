import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

@NgModule({
	imports: [
		CommonModule,
		NgxMapboxGLModule.forRoot({
			accessToken: null
		})
	],
	declarations: []
})
export class MapQuestionModule { }
