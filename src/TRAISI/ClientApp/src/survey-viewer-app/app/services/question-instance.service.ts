import { Injectable } from '@angular/core';
import { SurveyViewQuestion } from 'app/models/survey-view-question.model';
import {
	SurveyQuestion,
	ResponseTypes,
	SurveyRespondent,
	ResponseData,
	ResponseValidationState,
} from 'traisi-question-sdk';
import { SurveyViewerResponseService } from './survey-viewer-response.service';
import { SurveyNavigator } from 'app/modules/survey-navigation/services/survey-navigator/survey-navigator.service';

@Injectable()
export class QuestionInstanceState {
	private _questionModel: SurveyViewQuestion;
	private _questionInstance: SurveyQuestion<ResponseTypes>;
	private _respondent: SurveyRespondent;
	private _repeatIndex: number = 0;
	public constructor(private _responseService: SurveyViewerResponseService, private _navigator: SurveyNavigator) {}

	/**
	 * Initializes the instance state manager for the passed question
	 * @param respondent
	 * @param questionModel
	 * @param questionInstance
	 */
	public initialize(respondent: SurveyRespondent, questionModel: SurveyViewQuestion, questionInstance: any, repeatIndex: number = 0): void {
		this._respondent = respondent;
		this._questionInstance = questionInstance;
		this._questionModel = questionModel;
		this._repeatIndex = repeatIndex;
		this._questionInstance.response.subscribe(this.onSaveResponse);
		this._questionInstance.validationState.subscribe(this.onValidationStateChanged);
		this._questionInstance.respondent = respondent;
	}

	/**
	 * Handles saving a response when a question emits a new response
	 * @param response
	 */
	private onSaveResponse(response: ResponseData<ResponseTypes>[] | ResponseData<ResponseTypes>[]): void {
		this._responseService
			.saveResponse(this._questionModel, this._respondent, 0, response)
			.subscribe(this.onResponseSaved);
	}

	/**
	 * Handles the server response after a response has been saved.
	 * @param result
	 */
	private onResponseSaved(result: boolean): void {
		this._navigator.responseChanged();
	}

	private onValidationStateChanged(state: ResponseValidationState): void {}
}
