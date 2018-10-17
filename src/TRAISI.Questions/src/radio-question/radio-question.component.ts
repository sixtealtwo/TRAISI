import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import {
	SurveyQuestion,
	ResponseTypes,
	SurveyResponder,
	QuestionConfiguration,
	SurveyViewer,
	OnSurveyQuestionInit,
	OnVisibilityChanged,
	OnSaveResponseStatus,
	StringResponseData,
	OnOptionsLoaded,
	QuestionOption
} from 'traisi-question-sdk';

@Component({
	selector: 'traisi-radio-question',
	template: <string>require('./radio-question.component.html'),
	styles: [require('./radio-question.component.scss').toString()]
})
export class RadioQuestionComponent extends SurveyQuestion<ResponseTypes.List> implements OnInit, OnOptionsLoaded {


	public options: QuestionOption[];


	public selectdOption: any;

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
	public ngOnInit(): void {
		this._surveyViewerService.options.subscribe((value: QuestionOption[]) => {});


	}

	/**
	 *
	 * @param options
	 */
	public onOptionsLoaded(options: QuestionOption[]): void {
		this.options = options;
	}

	public traisiOnInit(): void {
	}
}
