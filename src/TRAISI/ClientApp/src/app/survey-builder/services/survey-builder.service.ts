import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SurveyBuilderEndpointService } from './survey-builder-endpoint.service';
import { Observable } from 'rxjs';
import { QuestionTypeDefinition } from '../models/question-type-definition';
import { UploadPath } from '../models/upload-path';

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
	public getQuestionTypes(): Observable<QuestionTypeDefinition[]> {
		return this.surveyBuilderEndpointService.getQuestionTypesEndpoint<QuestionTypeDefinition[]>();
	}

	public deleteUploadedFile(filePath: UploadPath) {
		return this.surveyBuilderEndpointService.getDeleteUploadedFileEndopint<UploadPath>(filePath);
	}
}
