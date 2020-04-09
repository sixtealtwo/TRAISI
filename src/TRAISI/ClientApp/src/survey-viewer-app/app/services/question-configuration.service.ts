import { QuestionLoaderEndpointService } from './question-loader-endpoint.service';
import { Injectable } from '@angular/core';
import { SurveyViewQuestion as ISurveyQuestion } from '../models/survey-view-question.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'platform'
})
export class QuestionConfigurationService {
	private _configurations: { [type: string]: any } = {};

	constructor(
	) {}

	public setQuestionServerConfiguration(question: ISurveyQuestion, configuration: any): void {
		this._configurations[question.questionType] = configuration;
	}

	public getQuestionServerConfiguration(
		question: string
	): any {
		return this._configurations[question];
	}
}
