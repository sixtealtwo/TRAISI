import { Injectable } from '@angular/core';
import { SurveyResponder } from 'traisi-question-sdk';
import { SurveyResponderEndpointService } from './survey-responder-endpoint.service';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SurveyResponderService implements SurveyResponder {
	saveStringResponse(data: string): Observable<any> {
		throw new Error('Method not implemented.');
	}
	saveBooleanResponse(data: boolean): Observable<any> {
		throw new Error('Method not implemented.');
	}
	saveIntegerResponse(data: number): Observable<any> {
		throw new Error('Method not implemented.');
	}
	saveDecimalResponse(data: number): Observable<any> {
		throw new Error('Method not implemented.');
	}
	saveLocationResponse(data: string): Observable<any> {
		throw new Error('Method not implemented.');
	}
	saveJsonResponse(data: object): Observable<any> {
		throw new Error('Method not implemented.');
	}
	saveOptionListResponse(data: any[]): Observable<any> {
		throw new Error('Method not implemented.');
	}
	saveDateTimeResponse(data: Date): Observable<any> {
		throw new Error('Method not implemented.');
	}

	constructor(private _surveyResponseEndpointService: SurveyResponderEndpointService) {}
}
