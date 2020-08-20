import { QuestionLoaderEndpointService } from './question-loader-endpoint.service';
import { Injectable } from '@angular/core';
import { SurveyViewQuestion as ISurveyQuestion } from '../models/survey-view-question.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'platform',
})
export class QuestionConfigurationService {
	private _configurations: { [type: string]: any } = {};

	constructor() {}

	public setQuestionServerConfiguration(question: ISurveyQuestion, configuration: any): void {
		this._configurations[question.questionType] = configuration;
	}

	public getQuestionServerConfiguration(question: string): any {
		return this._configurations[question];
	}

	public listConfigurations(): { question: string; property: string[], value: string [] }[] {
		let result = [];
		for (let k of Object.keys(this._configurations)) {
			for (let p of Object.keys(this._configurations[k])) {
				result.push({
					question: k,
					property: p,
					value: this._configurations[k][p]
				});
			}
		}
		return result;
	}
}
