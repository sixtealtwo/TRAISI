import { EndpointFactory } from '../../services/endpoint-factory.service';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs';
import { UploadPath } from '../models/upload-path';

@Injectable()
export class SurveyBuilderEndpointService extends EndpointFactory {
	private readonly _surveyBuilderUrl: string = '/api/SurveyBuilder';
	private readonly _deleteUploadedUrl: string = '/api/Upload/delete';

	get surveyBuilderUrl() {
		return this.configurations.baseUrl + this._surveyBuilderUrl;
	}

	get deleteUploadedUrl() {
		return this.configurations.baseUrl + this._deleteUploadedUrl;
	}

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

	public getQuestionTypesEndpoint<T>(): Observable<T> {
		let endpointUrl = this.getSurveyBuilderQuestionTypesUrl;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getQuestionTypesEndpoint()
				);
			})
		);
	}

	public getDeleteUploadedFileEndopint<T>(filePath: UploadPath): Observable<T> {
		let endpointUrl = this.deleteUploadedUrl;
		return this.http.post<T>(endpointUrl, JSON.stringify(filePath), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getDeleteUploadedFileEndopint(filePath));
			})
		);
	}
}
