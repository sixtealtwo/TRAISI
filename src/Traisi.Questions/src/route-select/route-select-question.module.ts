import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import {
	CalendarModule,
	DateAdapter,
	CalendarCommonModule,
	CalendarDayModule,
	CalendarTooltipWindowComponent,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';
import { RouteSelectQuestionComponent } from './route-select-question.component';
import { GeoServiceClient } from './geoservice-api-client.service';

@NgModule({
	declarations: [RouteSelectQuestionComponent],
	entryComponents: [RouteSelectQuestionComponent],
	providers: [
		GeoServiceClient,
		{
			provide: 'widgets',
			useValue: [
				{
					name: 'traisi-route-select-question',
					id: 'route-select',
					component: RouteSelectQuestionComponent,
				},
			],
			multi: true,
		},
	],
	imports: [],
	exports: [],
})
export default class RouteSelectQuestionModule {
	static forRoot(): ModuleWithProviders<RouteSelectQuestionModule> {
		return {
			ngModule: RouteSelectQuestionModule,
			providers: [RouteSelectQuestionComponent],
		};
	}
}
