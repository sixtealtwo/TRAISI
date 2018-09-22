import { Injectable } from '@angular/core';
import { SurveyResponder, TRAISI } from 'traisi-question-sdk';
import { SurveyResponderEndpointService } from './survey-responder-endpoint.service';
import { Observable } from 'rxjs';

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
	public registerQuestion(questionComponent: TRAISI.SurveyQuestion<any>) {
		console.log('Inside requesting loading');
		console.log(questionComponent);

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
	private handleResponse(response: TRAISI.ResponseData<any>) {
		if (response instanceof TRAISI.StringResponseData) {
			console.log('string respoinse');
		}
	}

	constructor(private _surveyResponseEndpointService: SurveyResponderEndpointService) {}
}
