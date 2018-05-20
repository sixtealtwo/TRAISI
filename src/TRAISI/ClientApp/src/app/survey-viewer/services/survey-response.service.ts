import { Injectable } from '@angular/core';
import { SurveyResponseEndpointService } from './survey-response-endpoint.service';

@Injectable({
	providedIn: 'root'
})
export class SurveyResponseService {

	constructor(private _surveyResponseEndpointService: SurveyResponseEndpointService) { }
}
