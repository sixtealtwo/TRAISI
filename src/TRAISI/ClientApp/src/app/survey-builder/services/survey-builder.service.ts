import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SurveyBuilderEndpointService } from './survey-builder-endpoint.service';
import { Observable } from 'rxjs';
import { QuestionTypeDefinition } from '../models/question-type-definition';
import { UploadPath } from '../models/upload-path';
import { WelcomePage } from '../models/welcome-page.model';
import { TermsAndConditionsPage } from '../models/terms-and-condiitions-page.model';
import { ThankYouPage } from '../models/thank-you-page.model';
import { SurveyViewStructure } from '../models/survey-view-structure.model';
import { QuestionPartView } from '../models/question-part-view.model';

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

	public getStandardWelcomePage(surveyId: number, language: string): Observable<WelcomePage>  {
		return this.surveyBuilderEndpointService.getStandardWelcomePageEndpoint<WelcomePage>(surveyId, language);
	}

	public getStandardTermsAndConditionsPage(surveyId: number, language: string): Observable<TermsAndConditionsPage>  {
		return this.surveyBuilderEndpointService.getStandardTermsAndConditionsPageEndpoint<TermsAndConditionsPage>(surveyId, language);
	}

	public getStandardThankYouPage(surveyId: number, language: string): Observable<ThankYouPage>  {
		return this.surveyBuilderEndpointService.getStandardThankYouPageEndpoint<ThankYouPage>(surveyId, language);
	}

	public updateStandardWelcomePage(surveyId: number, welcomePage: WelcomePage): Observable<WelcomePage>  {
		return this.surveyBuilderEndpointService.getUpdateStandardWelcomePageEndpoint<WelcomePage>(surveyId, welcomePage);
	}

	public updateStandardTermsAndConditionsPage(surveyId: number, tAndCPage: TermsAndConditionsPage): Observable<TermsAndConditionsPage>  {
		return this.surveyBuilderEndpointService.getUpdateStandardTermsAndConditionsPageEndpoint<TermsAndConditionsPage>(surveyId, tAndCPage);
	}

	public updateStandardThankYouPage(surveyId: number, thankYouPage: ThankYouPage): Observable<ThankYouPage>  {
		return this.surveyBuilderEndpointService.getUpdateStandardThankYouPageEndpoint<ThankYouPage>(surveyId, thankYouPage);
	}

	public getStandardViewPageStructure(surveyId: number, language: string): Observable<SurveyViewStructure> {
		return this.surveyBuilderEndpointService.getStandardViewPageStructureEndpoint<SurveyViewStructure>(surveyId, language);
	}

	public addStandardPage(surveyId: number, language: string, pageInfo: QuestionPartView) {
		return this.surveyBuilderEndpointService.getAddStandardPageEndpoint<QuestionPartView>(surveyId, language, pageInfo);
	}
}
