import { EndpointFactory } from 'app/services/endpoint-factory.service';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'app/services/configuration.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs/index';

@Injectable()
export class SurveyBuilderEndpointService extends EndpointFactory {
	private readonly _surveyBuilderUrl: string = '/api/SurveyBuilder';

	get getSurveyBuilderQuestionTypesUrl() {
		return (
			this.configurations.baseUrl +
			this._surveyBuilderUrl +
			'/question-types'
		);
	}
	constructor(
		http: HttpClient,
		configurations: ConfigurationService,
		injector: Injector
	) {
		super(http, configurations, injector);
	}

	getQuestionTypesEndpoint<T>(): Observable<T> {
		let endpointUrl = this.getSurveyBuilderQuestionTypesUrl;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getQuestionTypesEndpoint()
				);
			})
		);
	}
}
