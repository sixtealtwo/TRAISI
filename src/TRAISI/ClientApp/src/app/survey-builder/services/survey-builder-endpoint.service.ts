import { EndpointFactory } from '../../services/endpoint-factory.service';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs';
import { UploadPath } from '../models/upload-path';
import { WelcomePage } from '../models/welcome-page.model';
import { QuestionPartView } from '../models/question-part-view.model';

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

	public getStandardWelcomePageEndpoint<T>(surveyId: number, language: string): Observable<T> {
		const endpointUrl = `${this.surveyBuilderUrl}/${surveyId}/WelcomePage/Standard/${language}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getStandardWelcomePageEndpoint(surveyId, language));
			})
		);
	}

	public getStandardTermsAndConditionsPageEndpoint<T>(surveyId: number, language: string): Observable<T> {
		const endpointUrl = `${this.surveyBuilderUrl}/${surveyId}/TermsAndConditionsPage/Standard/${language}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getStandardTermsAndConditionsPageEndpoint(surveyId, language));
			})
		);
	}

	public getStandardThankYouPageEndpoint<T>(surveyId: number, language: string): Observable<T> {
		const endpointUrl = `${this.surveyBuilderUrl}/${surveyId}/ThankYouPage/Standard/${language}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getStandardWelcomePageEndpoint(surveyId, language));
			})
		);
	}

	public getUpdateStandardWelcomePageEndpoint<T>(surveyId: number, welcomePage: WelcomePage): Observable<T> {
		const endpointUrl = `${this.surveyBuilderUrl}/${surveyId}/WelcomePage`;

		return this.http.put<T>(endpointUrl, JSON.stringify(welcomePage), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getUpdateStandardWelcomePageEndpoint(surveyId, welcomePage));
			})
		);
	}

	public getUpdateStandardTermsAndConditionsPageEndpoint<T>(surveyId: number, welcomePage: WelcomePage): Observable<T> {
		const endpointUrl = `${this.surveyBuilderUrl}/${surveyId}/TermsAndConditionsPage`;

		return this.http.put<T>(endpointUrl, JSON.stringify(welcomePage), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getUpdateStandardTermsAndConditionsPageEndpoint(surveyId, welcomePage));
			})
		);
	}

	public getUpdateStandardThankYouPageEndpoint<T>(surveyId: number, welcomePage: WelcomePage): Observable<T> {
		const endpointUrl = `${this.surveyBuilderUrl}/${surveyId}/ThankYouPage`;

		return this.http.put<T>(endpointUrl, JSON.stringify(welcomePage), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getUpdateStandardThankYouPageEndpoint(surveyId, welcomePage));
			})
		);
	}

	public getStandardViewPageStructureEndpoint<T>(surveyId: number, language: string): Observable<T> {
		const endpointUrl = `${this.surveyBuilderUrl}/${surveyId}/PageStructure/Standard/${language}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getStandardViewPageStructureEndpoint(surveyId, language));
			})
		);
	}

	public getAddStandardPageEndpoint<T>(surveyId: number, language: string, pageInfo: QuestionPartView): Observable<T> {
		const endpointUrl = `${this.surveyBuilderUrl}/${surveyId}/Page/Standard/${language}`;

		return this.http.post<T>(endpointUrl, JSON.stringify(pageInfo), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getAddStandardPageEndpoint(surveyId, language, pageInfo));
			})
		);
	}

	public getDeleteStandardPageEndpoint<T>(surveyId: number, pageId: number): Observable<T> {
		const endpointUrl = `${this.surveyBuilderUrl}/${surveyId}/Page/Standard/${pageId}`;

		return this.http.delete<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getDeleteStandardPageEndpoint(surveyId, pageId));
			})
		);
	}

	public getUpdateStandardViewPageOrderEndpoint<T>(surveyId: number, pageOrder: QuestionPartView[]): Observable<T> {
		const endpointUrl = `${this.surveyBuilderUrl}/${surveyId}/PageStructure/Standard/UpdateOrder`;

		return this.http.post<T>(endpointUrl, JSON.stringify(pageOrder), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getUpdateStandardViewPageOrderEndpoint(surveyId, pageOrder));
			})
		);
	}

}
