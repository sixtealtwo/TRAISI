import { Injectable } from "@angular/core";
import {SurveyEndpointService} from './survey-endpoint.service';
import {Survey} from "../models/survey.model";
@Injectable()
export class SurveyService
{

	constructor(private _surveyEndpointService: SurveyEndpointService)
	{

	}

	public  listSurveys(page?: number, pageSize?: number)
	{
		return this._surveyEndpointService.listSurveysEndpoint(page, pageSize);

	}

}