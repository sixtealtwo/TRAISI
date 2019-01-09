import { Injectable, Injector } from '@angular/core';
import { EndpointFactory } from '../../../shared/services/endpoint-factory.service';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { SurveyViewerEndpointFactory } from './survey-viewer-endpoint-factory.service';

@Injectable({
	providedIn: 'root'
})
export class SurveyRespondentEndpointGroupService  extends SurveyViewerEndpointFactory {

	private readonly _surveyViewQuestionsUrl: string = '/api/SurveyViewer';
	private readonly _surveyViewerUrl: string = '/api/SurveyViewer';

	/**
	 *Creates an instance of SurveyResponderEndpointGroupService.
	 * @param {HttpClient} http
	 * @param {ConfigurationService} configurations
	 * @param {Injector} injector
	 * @memberof SurveyResponderEndpointGroupService
	 */
	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
		super(http, configurations, injector);
	}
}
