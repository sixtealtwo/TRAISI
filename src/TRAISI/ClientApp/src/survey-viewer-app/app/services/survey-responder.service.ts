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
import { Observable, Subject, EMPTY } from 'rxjs';
import { SurveyViewerService } from './survey-viewer.service';
import { flatMap, map, share } from 'rxjs/operators';
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

	private _cachedByNameSavedResponses: { [questionName: string]: { [respondentId: number]: any } };

	public id: number;

	public primaryRespondent: SurveyRespondent;

	/**
	 *
	 * @param _surveyResponseEndpointService
	 * @param _surveyViewerService
	 */
	constructor(private _surveyResponseEndpointService: SurveyResponderEndpointService) {
		this._cachedSavedResponses = {};
		this._cachedByNameSavedResponses = {};
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
		// determine if responses are in question cache
		if (Object.keys(this._cachedSavedResponses).some(r => questionIds.includes(Number(r)))) {
			// use cached responses
			let responses = [];
			for (let key in this._cachedSavedResponses) {
				if (questionIds.includes(Number(key))) {
					responses.push(this._cachedSavedResponses[Number(key)][respondentId]);
				}
			}
			return Observable.of([responses]);
		} else {
			// don't use cached responses
			return this._surveyResponseEndpointService.getListResponsesForQuestionsUrlEndpoint(questionIds, respondentId);
		}
	}

	/**
	 * @param {string} questionName
	 * @param {SurveyRespondent} respondent
	 * @returns {*}
	 * @memberof SurveyResponderService
	 */
	public getResponseValue(questionName: string, respondent: SurveyRespondent): any {
		return this._cachedByNameSavedResponses[questionName][respondent.id];
	}

	/**
	 * @param {Array<string>} questionNames
	 * @param {SurveyRespondent} respondent
	 * @returns {Observable<Array<any>>}
	 * @memberof SurveyResponderService
	 */
	public listResponsesForQuestionsByName(questionNames: Array<string>, respondent: SurveyRespondent): Observable<any> {

		if (Object.keys(this._cachedByNameSavedResponses).some(r => questionNames.includes(String(r)))) {
			// use cached responses
			let responses = [];
			for (let key in this._cachedByNameSavedResponses) {
				if (questionNames.includes(String(key))) {
					responses.push(this._cachedByNameSavedResponses[String(key)][respondent.id]);
				}
			}
			return Observable.of([responses]);
		} else {
			// don't use cached responses
			let responses = this._surveyResponseEndpointService.getListResponsesForQuestionsByNameUrlEndpoint(questionNames, respondent.id).pipe(share());
			responses.subscribe((results: Array<any>) => {
				console.log(results);
				for (let result of results) {
					this._cachedByNameSavedResponses[String(result.questionPart.name)] = {};
					this._cachedByNameSavedResponses[String(result.questionPart.name)][respondent.id] = result.responseValues;
				}

				console.log(this._cachedByNameSavedResponses);
			});
			return responses;
		}
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
	 *
	 * @param {Array<string>} questionIds
	 * @param {SurveyRespondent} respondent
	 * @returns {Observable<any>}
	 * @memberof SurveyResponderService
	 */
	public loadSurveyResponses(questionIds: Array<string>, respondent: SurveyRespondent): Observable<any> {
		return null;
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
			map(responses => {
				for (let i = 0; i < responses.length; i++) {
					if (i < questionIds.length) {
						this._cachedSavedResponses[questionIds[i]][respondentId] = [];
						responses[i].responseValues.forEach(responseValue => {
							this._cachedSavedResponses[questionIds[i]][respondentId].push(responseValue);
						});
					}
				}
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

		return this._surveyResponseEndpointService.getSaveResponseUrlEndpoint(surveyId, questionId, respondentId, data, repeat);
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
				this.handleResponse(questionComponent, value, surveyId, questionId, respondentId, saved, questionModel, repeat);
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
	public getSavedResponse(surveyId: number, questionId: number, respondentId: number, repeat: number): Observable<ResponseValue<any>> {
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
		questionComponent: SurveyQuestion<ResponseTypes> | SurveyQuestion<ResponseTypes[]> | SurveyQuestion<any> | OnSaveResponseStatus,
		response: ResponseData<ResponseTypes | ResponseTypes[]>,
		surveyId: number,
		questionId: number,
		respondentId: number,
		saved: Subject<boolean>,
		questionModel: SurveyViewQuestion,
		repeat: number
	): void {
		if (response instanceof Array) {
			this.saveResponse({ values: response }, surveyId, questionId, respondentId, questionModel, repeat).subscribe(
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
		questionComponent: SurveyQuestion<ResponseTypes> | SurveyQuestion<ResponseTypes[]> | SurveyQuestion<any> | OnSaveResponseStatus,
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

	public getSurveyPrimaryRespondent(surveyId: number): Observable<any> {
		return this._surveyResponseEndpointService.getSurveyPrimaryRespondentUrlEndpoint(surveyId);
	}

	/**
	 *
	 *
	 * @param {SurveyRespondent} respondent
	 * @returns {Observable<{}>}
	 * @memberof SurveyResponderService
	 */
	public addSurveyGroupMember(respondent: SurveyRespondent): Observable<{}> {
		return this._surveyResponseEndpointService.getAddSurveyGroupMemberUrlEndpoint(respondent);
	}

	/**
	 *
	 *
	 * @param {number} respondentId
	 * @returns {Observable<{}>}
	 * @memberof SurveyResponderService
	 */
	public getSurveyGroupMembers(respondent: SurveyRespondent): Observable<any> {
		return this._surveyResponseEndpointService.getSurveyGroupMembersUrlEndpoint(respondent);
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

	/**
	 *
	 *
	 * @param {number} surveyId
	 * @param {ResponseTypes} type
	 * @returns {Observable<any>}
	 * @memberof SurveyResponderService
	 */
	public listSurveyResponsesOfType(surveyId: number, type: ResponseTypes): Observable<any> {
		return this._surveyResponseEndpointService.getListSurveyResponsesOfType(surveyId, type);
	}

	/**
	 *
	 * @param {number} surveyId
	 * @returns {Observable<{}>}
	 * @memberof SurveyResponderService
	 */
	preparePreviousSurveyResponses(respondent: SurveyRespondent): Observable<{}> {
		//get all question IDs
		return Observable.of();
	}
}
