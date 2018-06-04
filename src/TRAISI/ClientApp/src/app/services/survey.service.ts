import { Injectable } from '@angular/core';
import { SurveyEndpointService } from './survey-endpoint.service';
import { Survey } from '../models/survey.model';
import { map } from 'rxjs/operators';

import {forkJoin as observableForkJoin,  Observable ,  Subject } from 'rxjs';
@Injectable()
export class SurveyService {
	constructor(private _surveyEndpointService: SurveyEndpointService) {}

	/**
	 * Lists all surveys.
	 * @param  {number} page?
	 * @param  {number} pageSize?
	 */
	public listSurveys(page?: number, pageSize?: number): Observable<Survey[]> {
		return this._surveyEndpointService.getListSurveysEndpoint<Survey[]>(page, pageSize).pipe(map(surveys => {
			return surveys.map(survey => {
				survey.startAt = new Date(survey.startAt);
				survey.endAt = new Date(survey.endAt);
				survey.createdDate = new Date(survey.createdDate);
				survey.updatedDate = new Date(survey.updatedDate);
				return survey;
			});
		}));
	}

	public listGroupSurveys(id: number): Observable<Survey[]> {
		return this._surveyEndpointService.getListGroupSurveysEndpoint<Survey[]>(id).pipe(map(surveys => {
			return surveys.map(survey => {
				survey.startAt = new Date(survey.startAt);
				survey.endAt = new Date(survey.endAt);
				survey.createdDate = new Date(survey.createdDate);
				survey.updatedDate = new Date(survey.updatedDate);
				return survey;
			});
		}));
	}

	/**
	 * Creates a new survey with the passed survey details.
	 * @param  {any} survey
	 */
	public createSurvey(survey: any) {
		return this._surveyEndpointService.getCreateSurveyEndpoint<Survey>(survey);
	}

	/**
	 * Edits (submits) updated survey information.
	 * @param  {any} survey Survey object with updated data.
	 */
	public editSurvey(survey: any) {
		return this._surveyEndpointService.getEditSurveyEndpoint<Survey>(survey);
	}

	/**
	 * Deletes the passed survey.
	 * @param  {Survey} survey
	 */
	public deleteSurvey(id: number) {
		return this._surveyEndpointService.getDeleteSurveyEndpoint<number>(id);
	}

	/**
	 * Retrieves survey with specified id.
	 * @param id
	 */
	public getSurvey(id: number) {
		return this._surveyEndpointService.getSurveyEndpoint<Survey>(id);
	}
}
