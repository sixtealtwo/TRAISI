import { EndpointFactory } from 'shared/services/endpoint-factory.service';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'shared/services/configuration.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class QuestionLoaderEndpointService extends EndpointFactory {
	private readonly _surveyViewQuestionsUrl: string = '/api/Question';

	get questionTypesUrl() {
		return this.configurations.baseUrl + '' + this._surveyViewQuestionsUrl + '/question-types';
	}

	get getClientCodeUrl() {
		return this._surveyViewQuestionsUrl + '/client-code';
	}

	/**
	 * Returns all available question type definitions
	 * @returns {Observable<T>}
	 */
	getQuestionTypesEndpoint<T>(): Observable<T> {
		let endpointUrl = `${this.questionTypesUrl}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getQuestionTypesEndpoint());
			})
		);
	}

	/**
	 * Returns the client code endpoint URL
	 * @param questionType
	 */
	public getClientCodeEndpointUrl(questionType: string): string {
		return `${this.getClientCodeUrl}/${questionType}`;
	}

	/**
	 * Creates the endpoint that retrieves the compiled (javascript) client code
	 * for the passed question type.
	 * @param questionType
	 */
	getClientCodeEndpoint<T>(questionType: string): Observable<T> {
		let endpointUrl = this.getClientCodeEndpointUrl(questionType);

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getClientCodeEndpoint(questionType));
			})
		);
	}
}
