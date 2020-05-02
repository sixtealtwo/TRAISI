import { Injectable } from '@angular/core';
import {
	SurveyQuestion,
	OnSaveResponseStatus,
	ResponseTypes,
	ResponseData,
	ResponseValue,
	SurveyRespondent,
} from 'traisi-question-sdk';
import { SurveyResponderEndpointService } from './survey-responder-endpoint.service';
import { Observable, Subject, EMPTY, interval } from 'rxjs';
import { flatMap, map, share, tap, throttle, debounceTime } from 'rxjs/operators';
import { SurveyViewQuestion } from '../models/survey-view-question.model';

@Injectable({
	providedIn: 'root',
})
export class SurveyResponderService {
	public id: number;

	public primaryRespondent: SurveyRespondent;

	/**
	 *
	 * @param _surveyResponseEndpointService
	 * @param _surveyViewerService
	 */
	constructor(private _surveyResponseEndpointService: SurveyResponderEndpointService) {}

	/**
	 * Registers question
	 * @param questionComponent
	 * @param surveyId
	 * @param questionId
	 * @param respondentId
	 * @param saved
	 * @param questionModel
	 * @param repeat
	
	public registerQuestion(
		questionComponent: SurveyQuestion<ResponseTypes> | SurveyQuestion<ResponseTypes[]>,
		surveyId: number,
		questionId: number,
		respondentId: number,
		saved: Subject<boolean>,
		questionModel: SurveyViewQuestion,
		repeat: number
	): void {
		questionComponent.response.pipe(debounceTime(200)).subscribe(
			(value: ResponseData<ResponseTypes | ResponseTypes[]>) => {
				this.handleResponse(
					questionComponent,
					value,
					surveyId,
					questionId,
					respondentId,
					saved,
					questionModel,
					repeat
				);
			},
			(error) => {
				console.log('An error occurred subscribing to ' + questionComponent + ' responses');
			}
		);
	}
 */

	/**
	 *
	 * @param questionComponent
	 * @param response
	 * @param surveyId
	 * @param questionId
	 * @param respondentId

	private handleResponse(
		questionComponent:
			| SurveyQuestion<ResponseTypes>
			| SurveyQuestion<ResponseTypes[]>
			| SurveyQuestion<any>
			| OnSaveResponseStatus,
		response: ResponseData<ResponseTypes | ResponseTypes[]>,
		surveyId: number,
		questionId: number,
		respondentId: number,
		saved: Subject<boolean>,
		questionModel: SurveyViewQuestion,
		repeat: number
	): void {
		if (response instanceof Array) {
			this.saveResponse(
				{ values: response },
				surveyId,
				questionId,
				respondentId,
				questionModel,
				repeat
			).subscribe(
				(responseValid: boolean) => {
					this.onSavedResponse(questionComponent, questionId, respondentId, response, responseValid, saved);
				},
				(error) => {
					console.log(error);
				}
			);
		} else if (typeof response === 'number') {
			this.saveResponse({ value: response }, surveyId, questionId, respondentId, questionModel, repeat).subscribe(
				(responseValid: boolean) => {
					this.onSavedResponse(questionComponent, questionId, respondentId, response, responseValid, saved);
				},
				(error) => {
					console.log(error);
				}
			);
		} else {
			this.saveResponse(response, surveyId, questionId, respondentId, questionModel, repeat).subscribe(
				(responseValid: boolean) => {
					this.onSavedResponse(questionComponent, questionId, respondentId, response, responseValid, saved);
				},
				(error) => {
					console.log(error);
				}
			);
		}
	}
	 */
	/**
	 * Determines whether saved response on
	 * @param questionComponent
	 * @param questionId
	 * @param respondentId
	 * @param data
	 * @param responseValid
	 * @param saved

	private onSavedResponse(
		questionComponent:
			| SurveyQuestion<ResponseTypes>
			| SurveyQuestion<ResponseTypes[]>
			| SurveyQuestion<any>
			| OnSaveResponseStatus,
		questionId: number,
		respondentId: number,
		data: any,
		responseValid: boolean,
		saved: Subject<boolean>
	): void {
		if (responseValid) {
			this._cachedSavedResponses[questionId][respondentId] = data;
		}

		saved.next(responseValid);

		if (Object.getPrototypeOf(questionComponent).hasOwnProperty('onResponseSaved')) {
			(<OnSaveResponseStatus>questionComponent).onResponseSaved(responseValid);
		}
	}	 */
}
