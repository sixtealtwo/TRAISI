import { Injectable } from '@angular/core';
import {
	SurveyResponder,
	SurveyQuestion,
	OnSaveResponseStatus,
	ResponseTypes,
	ResponseData,
	ResponseValue,
	SurveyRespondent
} from '../../../../../../TRAISI.SDK/Module/src';
import { SurveyResponderEndpointService } from './survey-responder-endpoint.service';
import { Observable, Subject } from 'rxjs';
import { SurveyViewerService } from './survey-viewer.service';
import { flatMap } from 'rxjs/operators';
import { SurveyViewerStateService } from './survey-viewer-state.service';
import { SurveyViewQuestion } from '../models/survey-view-question.model';

@Injectable({
	providedIn: 'root'
})
export class SurveyResponderService implements SurveyResponder {
	/**
	 * A dictionary of saved responses, cache purposes
	 */
	private _cachedSavedResponses: { [questionId: number]: { [respondentId: number]: any } };

	public id: number;

	/**
	 *
	 * @param _surveyResponseEndpointService
	 * @param _surveyViewerService
	 */
	constructor(private _surveyResponseEndpointService: SurveyResponderEndpointService) {
		this._cachedSavedResponses = {};
	}

	/**
	 *
	 * @param questionId
	 * @param respondentId
	 */
	public getCachedSavedResponse(questionId: number, respondentId: number): any {
		return this._cachedSavedResponses[questionId][respondentId];
	}

	/**
	 *
	 * @param questionIds
	 * @param respondentId
	 */
	public listResponsesForQuestions(questionIds: number[], respondentId: number): Observable<any> {
		return this._surveyResponseEndpointService.getListResponsesForQuestionsUrlEndpoint(questionIds, respondentId);
	}

	/**
	 * Deletes all responses
	 * @param surveyId
	 * @param respondent
	 * @returns all responses
	 */
	public deleteAllResponses(surveyId: number, respondent: SurveyRespondent): Observable<any> {
		return this._surveyResponseEndpointService.getDeleteAllResponsesEndpoint(surveyId, respondent);
	}

	/**
	 *
	 * @param questionIds
	 * @param respondentId
	 */
	public readyCachedSavedResponses(questionIds: number[], respondentId: number): Observable<any> {
		questionIds.forEach(id => {
			if (this._cachedSavedResponses[id] === undefined) {
				this._cachedSavedResponses[id] = {};
			}
		});

		return this.listResponsesForQuestions(questionIds, respondentId).pipe(
			flatMap(responses => {
				for (let i = 0; i < responses.length; i++) {
					if (i < questionIds.length) {
						this._cachedSavedResponses[questionIds[i]][respondentId] = [];
						responses[i].responseValues.forEach(responseValue => {
							this._cachedSavedResponses[questionIds[i]][respondentId].push(responseValue);
						});
					}
				}

				return Observable.of('');
			})
		);
	}

	/**
	 *
	 *
	 * @private
	 * @param {*} data
	 * @param {number} surveyId
	 * @param {number} questionId
	 * @returns
	 * @memberof SurveyResponderService
	 */
	private saveResponse(
		data: any,
		surveyId: number,
		questionId: number,
		respondentId: number,
		questionModel: SurveyViewQuestion,
		repeat: number
	): Observable<{}> {
		if (this._cachedSavedResponses[questionId] === undefined) {
			this._cachedSavedResponses[questionId] = {};
		}

		return this._surveyResponseEndpointService.getSaveResponseUrlEndpoint(
			surveyId,
			questionId,
			respondentId,
			data,
			repeat
		);
	}

	/**
	 * Registers question
	 * @param questionComponent
	 * @param surveyId
	 * @param questionId
	 * @param respondentId
	 * @param saved
	 * @param questionModel
	 * @param repeat
	 */
	public registerQuestion(
		questionComponent: SurveyQuestion<ResponseTypes> | SurveyQuestion<ResponseTypes[]>,
		surveyId: number,
		questionId: number,
		respondentId: number,
		saved: Subject<boolean>,
		questionModel: SurveyViewQuestion,
		repeat: number
	): void {
		questionComponent.response.subscribe(
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
			error => {
				console.log('An error occurred subscribing to ' + questionComponent + ' responses');
			}
		);
	}

	/**
	 * Returns the previously saved response for the active user for the specified survey id and question id
	 * @param surveyId
	 * @param questionId
	 */
	public getSavedResponse(
		surveyId: number,
		questionId: number,
		respondentId: number,
		repeat: number
	): Observable<ResponseValue<any>> {
		// this.listResponsesForQuestions([questionId, questionId], respondentId).subscribe(val => {});

		return this._surveyResponseEndpointService.getSavedResponseUrlEndpoint<ResponseValue<any>>(
			surveyId,
			questionId,
			respondentId,
			repeat
		);
	}

	/**
	 *
	 * @param questionComponent
	 * @param response
	 * @param surveyId
	 * @param questionId
	 * @param respondentId
	 */
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
				error => {
					console.log(error);
				}
			);
		} else if (typeof response === 'number') {
			this.saveResponse({ value: response }, surveyId, questionId, respondentId, questionModel, repeat).subscribe(
				(responseValid: boolean) => {
					this.onSavedResponse(questionComponent, questionId, respondentId, response, responseValid, saved);
				},
				error => {
					console.log(error);
				}
			);
		} else {
			this.saveResponse(response, surveyId, questionId, respondentId, questionModel, repeat).subscribe(
				(responseValid: boolean) => {
					this.onSavedResponse(questionComponent, questionId, respondentId, response, responseValid, saved);
				},
				error => {
					console.log(error);
				}
			);
		}
	}

	/**
	 * Determines whether saved response on
	 * @param questionComponent
	 * @param questionId
	 * @param respondentId
	 * @param data
	 * @param responseValid
	 * @param saved
	 */
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
	}

	/**
	 *
	 * @param respondent
	 */
	public addSurveyGroupMember(respondent: SurveyRespondent): Observable<{}> {
		return this._surveyResponseEndpointService.getAddSurveyGroupMemberUrlEndpoint(respondent);
	}

	public getSurveyGroupMembers(): Observable<{}> {
		return this._surveyResponseEndpointService.getSurveyGroupMembersUrlEndpoint();
	}

	/**
	 *
	 * @param respondent
	 */
	public removeSurveyGroupMember(respondent: SurveyRespondent): Observable<{}> {
		return this._surveyResponseEndpointService.getRemoveSurveyGroupMemberUrlEndpoint(respondent);
	}

	/**
	 *
	 * @param respondent
	 */
	public updateSurveyGroupMember(respondent: SurveyRespondent): Observable<{}> {
		return this._surveyResponseEndpointService.getUpdateSurveyGroupMemberUrlEndpoint(respondent);
	}


}
