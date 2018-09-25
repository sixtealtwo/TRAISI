import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import {
	SurveyViewer,
	QuestionConfiguration,
	SurveyResponder,
	ResponseValidationState,
	TRAISI
} from 'traisi-question-sdk';

@Component({
	selector: 'traisi-time-question',
	template: require('./time-question.component.html').toString(),
	styles: [require('./time-question.component.scss').toString()]
})
export class TimeQuestionComponent extends TRAISI.SurveyQuestion<TRAISI.ResponseTypes.Time> implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Time Question';

	typeName: string;
	icon: string;

	constructor(
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private surveyResponderService: SurveyResponder
	) {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'time';

		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: QuestionConfiguration[]) {
		console.log(data);
	}

	ngOnInit() {
		console.log('init');
	}
}
