import { EndpointFactory } from 'app/services/endpoint-factory.service';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'app/services/configuration.service';

@Injectable()
export class SurveyResponseEndpointService extends EndpointFactory
{
	/**
	 * Service constructor
	 * @param http
	 * @param configurations
	 * @param injector
	 */
	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector)
	{
		super(http, configurations, injector);
	}

}
