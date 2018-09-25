import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { SurveyViewer, QuestionOption, SurveyResponder, OnOptionsLoaded, ResponseValidationState, TRAISI } from 'traisi-question-sdk';

@Component({
	selector: 'traisi-radio-question',
	template: <string>require('./radio-question.component.html'),
	styles: [require('./radio-question.component.scss').toString()]
})
export class RadioQuestionComponent extends TRAISI.SurveyQuestion<TRAISI.ResponseTypes.List> implements OnInit, OnOptionsLoaded {
	readonly QUESTION_TYPE_NAME: string = 'Radio Question';

	options: QuestionOption[];

	typeName: string;
	icon: string;
	selectdOption: any;

	/**
	 *
	 * @param _surveyViewerService
	 * @param _surveyResponderService
	 */
	constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder
	) {
		super();
		this.options = [];
	}

	/**
	 *
	 */
	ngOnInit() {
		this._surveyViewerService.options.subscribe((value: QuestionOption[]) => {});
	}

	/**
	 *
	 * @param options
	 */
	onOptionsLoaded(options: QuestionOption[]): void {
		this.options = options;
	}

	traisiOnInit(): void {
	}
}
