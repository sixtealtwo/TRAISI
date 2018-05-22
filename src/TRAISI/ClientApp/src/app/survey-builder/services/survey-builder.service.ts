import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SurveyBuilderEndpointService } from './survey-builder-endpoint.service';
import { Observable } from 'rxjs';

@Injectable()
export class SurveyBuilderService {
	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private surveyBuilderEndpointService: SurveyBuilderEndpointService
	) {}

	/**
	 * Returns a list of question types that are available on the server.
	 */
	public getQuestionTypes<T>(): Observable<T> {
		return this.surveyBuilderEndpointService.getQuestionTypesEndpoint();
	}
}
