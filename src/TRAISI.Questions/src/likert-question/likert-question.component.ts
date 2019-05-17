import { Component, OnInit, Inject } from '@angular/core';
import { ResponseData, ResponseValidationState } from 'traisi-question-sdk';
import {
	SurveyQuestion,
	ResponseTypes,
	SurveyResponder,
	QuestionConfiguration,
	SurveyViewer,
	QuestionOption
} from 'traisi-question-sdk';

import templateString from './likert-question.component.html';
/**
 *
 * @export
 * @class LikertQuestionComponent
 * @extends {SurveyQuestion<ResponseTypes.List>}
 * @implements {OnInit}
 */
@Component({
	selector: 'traisi-likert-question',
	template: templateString,
	styles: [require('./likert-question.component.scss').toString()]
})
export class LikertQuestionComponent extends SurveyQuestion<ResponseTypes.List> implements OnInit {
	public readonly QUESTION_TYPE_NAME: string = 'Likert Question';


	public selectedOption: any;

	/**
	 *Creates an instance of LikertQuestionComponent.
	 * @param {SurveyViewer} _surveyViewerService
	 * @param {SurveyResponder} _surveyResponderService
	 * @memberof LikertQuestionComponent
	 */
	constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder
	) {
		super();
		this.selectedOption = { id: -1 };
	}

	/**
	 * Angular ngOnInit()
	 */
	public ngOnInit(): void {
		this.savedResponse.subscribe(this.onSavedResponseData);
		this.configuration = {
			options: ['A', 'B', 'C', 'D', 'E']
		};
	}

	/**
	 * @private
	 * @memberof LikertQuestionComponent
	 */
	private onSavedResponseData: (response: ResponseData<ResponseTypes.String>[] | 'none') => void = (
		response: ResponseData<ResponseTypes.String>[] | 'none'
	) => {
		if (response !== 'none') {
			this.selectedOption = response[0];
			this.validationState.emit(ResponseValidationState.VALID);
		}
	};

	/**
	 * 
	 * @param option 
	 */
	public onModelChanged(option: QuestionOption): void {
		this.response.emit([option]);

	}

	/**
	 * Response saved callback.
	 * @param result
	 */
	public onResponseSaved(result: any): void {
		this.validationState.emit(ResponseValidationState.VALID);
		// this.autoAdvance.emit(500);
	}
}
