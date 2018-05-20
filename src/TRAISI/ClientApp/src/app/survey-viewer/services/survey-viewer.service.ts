import { Injectable } from '@angular/core';
import { SurveyViewerEndpointService } from './survey-viewer-endpoint.service';

@Injectable({
	providedIn: 'root'
})
export class SurveyViewerService {

	constructor(private _surveyViewerEndpointService: SurveyViewerEndpointService) { }
}
