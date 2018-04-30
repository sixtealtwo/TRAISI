import { Injectable } from '@angular/core';
import {SurveyEndpointService} from './survey-endpoint.service';
import {Survey} from '../models/survey.model';
@Injectable()
export class SurveyService
{

	constructor(private _surveyEndpointService: SurveyEndpointService)
	{

	}

	/**
	 * Lists all surveys.
	 * @param  {number} page?
	 * @param  {number} pageSize?
	 */
	public  listSurveys(page?: number, pageSize?: number)
	{
		return this._surveyEndpointService.getListSurveysEndpoint(page, pageSize);

	}

	/**
	 * Creates a new survey with the passed survey details.
	 * @param  {any} survey
	 */
	public newSurvey(survey: any)
	{
		return this._surveyEndpointService.getNewSurveyEndpoint(survey);
	}

	/**
	 * Edits (submits) updated survey information.
	 * @param  {any} survey Survey object with updated data.
	 */
	public editSurvey(survey: any)
	{
		return this._surveyEndpointService.getEditSurveyEndpoint(survey);
	}

	/**
	 * Deletes the passed survey.
	 * @param  {Survey} survey
	 */
	public deleteSurvey(survey: Survey)
	{
		return this._surveyEndpointService.getDeleteSurveyEndpoint(survey);
	}

}
