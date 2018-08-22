import { Component, OnInit } from '@angular/core';
import { ISurveyViewerService, IQuestionConfiguration } from 'traisi-question-sdk';
import { PartialObserver } from '../../node_modules/rxjs';
@Component({
	selector: 'traisi-radio-question',
	template: require('./radio-question.component.html').toString(),
	styles: [require('./radio-question.component.scss').toString()]
})
export class RadioQuestionComponent implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Radio Question';

	typeName: string;
	icon: string;
	constructor(private surveyViewerService: ISurveyViewerService) {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'radio';

		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
		console.log('loaded');
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: IQuestionConfiguration[]){

		console.log(data);
	}

	ngOnInit() {
		console.log('init');
	}
}
