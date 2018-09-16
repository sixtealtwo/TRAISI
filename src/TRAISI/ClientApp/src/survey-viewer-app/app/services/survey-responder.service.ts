import {Injectable} from '@angular/core';
import {SurveyResponder, TRAISI} from 'traisi-question-sdk';
import {SurveyResponderEndpointService} from './survey-responder-endpoint.service';
import {Observable} from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SurveyResponderService implements SurveyResponder {
	saveStringResponse(data: string): Observable<any> {

		return null;
	}

	saveBooleanResponse(data: boolean): Observable<any> {
		return null;
	}

	saveIntegerResponse(data: number): Observable<any> {
		return null;
	}

	saveDecimalResponse(data: number): Observable<any> {
		return null;
	}

	saveLocationResponse(data: string): Observable<any> {
		return null;
	}

	saveJsonResponse(data: object): Observable<any> {
		return null;
	}

	saveOptionListResponse(data: any[]): Observable<any> {
		return null;
	}

	saveDateTimeResponse(data: Date): Observable<any> {
		return null;
	}

	/**
	 *
	 *
	 * @param {*} questionComponent
	 * @memberof SurveyResponderService
	 */
	public registerQuestion(questionComponent: TRAISI.SurveyQuestion)
	{
		questionComponent.response.subscribe(this.handleResponse, error => {
			console.log('An error occurred subscribing to ' + questionComponent + ' responses');

		});
	}

	/**
	 *
	 *
	 * @private
	 * @param {*} respone
	 * @memberof SurveyResponderService
	 */
	private handleResponse(response: TRAISI.Response)
	{
		switch (response.responseType) {
			case 'text':
				this.saveStringResponse(response.responseData);
				break;
			case 'boolean':
				this.saveBooleanResponse(response.responseData);
				break;
			case 'integer':
				this.saveIntegerResponse(response.responseData);
				break;
			case 'json':
				this.saveJsonResponse(response.responseData);
				break;
			case 'datetime':
				this.saveDateTimeResponse(response.responseData);
				break;
			case 'location':
				this.saveLocationResponse(response.responseData);
				break;
		}
	}

	constructor(private _surveyResponseEndpointService: SurveyResponderEndpointService) {
	}
}
