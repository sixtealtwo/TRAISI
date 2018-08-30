import { Component, OnInit } from '@angular/core';
import { SurveyViewer, QuestionConfiguration } from 'traisi-question-sdk';
import { PartialObserver } from '../../node_modules/rxjs';
import {OnOptionsLoaded, QuestionOption} from 'traisi-question-sdk';
@Component({
	selector: 'traisi-select-question',
	template: require('./select-question.component.html').toString(),
	styles: [require('./select-question.component.scss').toString()]
})
export class SelectQuestionComponent implements OnInit, OnOptionsLoaded {
	readonly QUESTION_TYPE_NAME: string = 'Select Question';

	typeName: string;
	icon: string;

	options: QuestionOption[];
	constructor(private surveyViewerService: SurveyViewer) {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'select';
		this.options = [];
		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
		console.log('loaded');
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: QuestionConfiguration[]){

		console.log(data);
	}

	ngOnInit() {

	}

	onOptionsLoaded(options: QuestionOption[]): void {
		this.options = options;
	}
}
