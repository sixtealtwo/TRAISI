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
import { isArray } from 'util';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { SurveyViewerValidationStateViewModel, ValidationState } from './survey-viewer-api-client.service';

@Injectable()
export class QuestionInstanceState {
	private _questionModel: SurveyViewQuestion;
	private _questionInstance: SurveyQuestion<ResponseTypes>;
	private _respondent: SurveyRespondent;
	private _repeatIndex: number = 0;

	public get questionInstance(): SurveyQuestion<ResponseTypes> {
		return this._questionInstance;
	}

	public get guestionModel(): SurveyViewQuestion {
		return this._questionModel;
	}

	public validationState$: BehaviorSubject<SurveyViewerValidationStateViewModel>;
	public constructor(private _responseService: SurveyViewerResponseService, private _navigator: SurveyNavigator) {}

	/**
	 * Initializes the instance state manager for the passed question
	 * @param respondent
	 * @param questionModel
	 * @param questionInstance
	 */
	public initialize(
		respondent: SurveyRespondent,
		questionModel: SurveyViewQuestion,
		questionInstance: SurveyQuestion<ResponseTypes>,
		repeatIndex: number = 0
	): void {
		this._respondent = respondent;
		this._questionInstance = questionInstance;
		this._questionModel = questionModel;
		this._repeatIndex = repeatIndex;
		this._questionInstance.response.subscribe(this.onSaveResponse);
		this._questionInstance.validationState.subscribe(this.onValidationStateChanged);
		this._questionInstance.respondent = respondent;
		this.validationState$ = new BehaviorSubject<SurveyViewerValidationStateViewModel>({
			isValid: false,
			questionValidationState: {
				errorMessages: [],
				validationState: ValidationState.Untouched,
			},
			surveyLogicValidationState: {
				errorMessages: [],
				validationState: ValidationState.Untouched,
			},
		});

		// load the saved response
		this.loadSavedResponse();
	}

	public forceSaveResponse(): Observable<void> {
		this._responseService.forceSaveInvalidResponse(this._questionModel, this._respondent).subscribe((result) => {
			this.onResponseSaved(result);
		});
		return null;
	}

	private loadSavedResponse(): void {
		this._responseService.loadSavedResponse(this._questionModel, this._respondent, 0).subscribe((response) => {
			this._questionInstance.savedResponse.next(
				response === undefined || response === null ? 'none' : response.responseValues
			);
			this._questionInstance.traisiOnLoaded();
		});
	}

	/**
	 * Handles saving a response when a question emits a new response
	 * @param response
	 */
	private onSaveResponse = (response: ResponseData<ResponseTypes>[] | ResponseData<ResponseTypes>[]): void => {
		// submit the response, convert it to single element
		// array if not done so
		this._responseService
			.saveResponse(this._questionModel, this._respondent, 0, Array.isArray(response) ? response : [response])
			.subscribe(this.onResponseSaved);
	};

	/**
	 * Handles the server response after a response has been saved.
	 * @param result
	 */
	private onResponseSaved = (result: SurveyViewerValidationStateViewModel): void => {
		console.log(result);
		this.validationState$.next(result);
		this._navigator.responseChanged();
		this.onValidationStateChanged(result);
	};

	/**
	 * @private
	 */
	private onValidationStateChanged = (
		state: SurveyViewerValidationStateViewModel | ResponseValidationState
	): void => {
		if (state.hasOwnProperty('isValid')) {
			this._navigator.updateQuestionValidationState(this, state as SurveyViewerValidationStateViewModel);
		} else {
			let responseState = state as ResponseValidationState;
			if (responseState === ResponseValidationState.VALID) {
				this._navigator.updateQuestionValidationState(this, {
					isValid: true,
					questionValidationState: {
						errorMessages: [],
						validationState: ValidationState.Valid,
					},
					surveyLogicValidationState: {
						errorMessages: [],
						validationState: ValidationState.Valid,
					},
				});
			}
		}
	};
}
