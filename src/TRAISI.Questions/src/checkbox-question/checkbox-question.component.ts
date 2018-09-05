import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {
	SurveyViewer,
	QuestionConfiguration,
	QuestionOption,
	OnOptionsLoaded,
	SurveyQuestion,
	QuestionResponseState
} from 'traisi-question-sdk';

@Component({
	selector: 'traisi-checkbox-question',
	template: require('./checkbox-question.component.html').toString(),
	styles: [require('./checkbox-question.component.scss').toString()]
})
export class CheckboxQuestionComponent implements OnInit, OnOptionsLoaded, SurveyQuestion {
	state: QuestionResponseState;

	readonly QUESTION_TYPE_NAME: string = 'Checkbox Question';

	typeName: string;
	icon: string;
	response: EventEmitter<any>;
	options: QuestionOption [];

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer) {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'checkbox';
		this.options = [];

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

	/**
	 *
	 * @param options
	 */
	onOptionsLoaded(options: QuestionOption[]): void {
		this.options = options;
	}
}
