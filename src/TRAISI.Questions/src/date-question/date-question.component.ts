import { Component, OnInit } from '@angular/core';
import { SurveyViewer, QuestionConfiguration } from 'traisi-question-sdk';
import { PartialObserver } from '../../node_modules/rxjs';
@Component({
	selector: 'traisi-date-question',
	template: require('./date-question.component.html').toString(),
	styles: [require('./date-question.component.scss').toString()]
})
export class DateQuestionComponent implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Date Question';

	typeName: string;
	icon: string;
	constructor(private surveyViewerService: SurveyViewer) {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'date';

		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: QuestionConfiguration[]){

	}

	ngOnInit() {
	}
}
