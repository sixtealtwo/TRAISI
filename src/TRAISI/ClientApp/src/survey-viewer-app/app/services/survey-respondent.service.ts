import { Injectable } from '@angular/core';
import { SurveyRespondent, SurveyQuestion } from 'traisi-question-sdk';
import { SurveyViewQuestion } from 'app/models/survey-view-question.model';
import { Observable, EMPTY } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SurveyRespondentService {
	private _responses: Record<number, Record<number, Array<any>>> = {};

	public constructor() {}
}
