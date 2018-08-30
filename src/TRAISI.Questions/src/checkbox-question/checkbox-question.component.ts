import {Component, Inject, OnInit} from '@angular/core';
import {SurveyViewer, QuestionConfiguration, QuestionOption, OnOptionsLoaded} from 'traisi-question-sdk';
import {PartialObserver} from '../../node_modules/rxjs';

@Component({
	selector: 'traisi-checkbox-question',
	template: require('./checkbox-question.component.html').toString(),
	styles: [require('./checkbox-question.component.scss').toString()]
})
export class CheckboxQuestionComponent implements OnInit, OnOptionsLoaded {

	readonly QUESTION_TYPE_NAME: string = 'Checkbox Question';

	typeName: string;
	icon: string;

	options: QuestionOption [];

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
