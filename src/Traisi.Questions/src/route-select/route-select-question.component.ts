import { Component, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { SurveyQuestion, ResponseTypes, TimelineResponseData, TraisiValues } from 'traisi-question-sdk';

import templateString from './route-select-question.component.html';
import styleString from './route-select-question.component.scss';
import { GeoServiceClient } from './geoservice-api-client.service';
@Component({
	selector: 'traisi-route-select-question',
	template: '' + templateString,
	providers: [],
	encapsulation: ViewEncapsulation.None,
	entryComponents: [],
	styles: ['' + styleString],
})
export class RouteSelectQuestionComponent extends SurveyQuestion<ResponseTypes.Json> implements OnInit {
	public constructor(
		@Inject(TraisiValues.RepeatSource) private _repeatSource: TimelineResponseData[],
		@Inject(TraisiValues.RepeatValue) private _repeatValue: TimelineResponseData,
		private _geoService: GeoServiceClient
	) {
		super();
	}
	public ngOnInit(): void {
		// retrieve the response of the timeine entry before this current one
		console.log(this);
		let idx = this._repeatSource.findIndex(
			(x) => x.latitude === this._repeatValue.latitude && x.timeA === this._repeatValue.timeA
		);

		console.log(idx);
		let priorEvent = this._repeatSource[idx - 1];

		this._geoService
			.routePlanner(
				this._repeatValue.latitude,
				this._repeatValue.longitude,
				priorEvent.latitude,
				priorEvent.longitude,
				new Date(),
				'PT',
				'',
				''
			)
			.subscribe((x) => {
				console.log(x);
			});
	}
}
