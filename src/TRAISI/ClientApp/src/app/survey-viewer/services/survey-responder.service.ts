import { Injectable } from '@angular/core';
import { SurveyResponderEndpointService } from './survey-responder-endpoint.service';

@Injectable({
	providedIn: 'root'
})
export class SurveyResponderService {

	constructor(private _surveyResponseEndpointService: SurveyResponderEndpointService) { }
}
