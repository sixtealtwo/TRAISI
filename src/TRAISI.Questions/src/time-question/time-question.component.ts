import { Component, OnInit } from '@angular/core';
import { SurveyViewer, QuestionConfiguration } from 'traisi-question-sdk';
import { PartialObserver } from '../../node_modules/rxjs';
@Component({
	selector: 'traisi-time-question',
	template: require('./time-question.component.html').toString(),
	styles: [require('./time-question.component.scss').toString()]
})
export class TimeQuestionComponent implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Time Question';

	typeName: string;
	icon: string;
	constructor(private surveyViewerService: SurveyViewer) {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'time';

		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: QuestionConfiguration[]){

		console.log(data);
	}

	ngOnInit() {
		console.log('init');
	}
}
