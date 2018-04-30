import { Injectable } from "@angular/core";
import {SurveyEndpointService} from './survey-endpoint.service';
@Injectable()
export class SurveyService
{

	constructor(private _surveyEndpointService: SurveyEndpointService)
	{
		
	}

	public Survey [] listSurveys(page?: number, pageSize?: number)
	{
		return this._surveyEndpointService.listSurveysEndpoint(page, pageSize);

	}

}