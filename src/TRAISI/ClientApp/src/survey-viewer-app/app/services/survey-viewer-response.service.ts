import { Injectable } from '@angular/core';
import { SurveyRespondent, SurveyQuestion } from 'traisi-question-sdk';
import { SurveyViewQuestion } from 'app/models/survey-view-question.model';
import { Observable, EMPTY } from 'rxjs';
import { SurveyResponseClient } from './survey-viewer-api-client.service';
import { SurveyViewerSession } from './survey-viewer-session.service';

@Injectable({
	providedIn: 'root',
})
export class SurveyViewerResponseService {
	private _responses: Record<number, Record<number, Array<any>>> = {};

	public constructor(private _responseClient: SurveyResponseClient, private _session: SurveyViewerSession) {}

	/**
	 * Gets the stored response for the passed respondent and question, this will return null
	 * if the response does not alreadyt exist.
	 * @param question
	 * @param respondent
	 */
	public getResponse(question: SurveyViewQuestion, respondent: SurveyRespondent): any {
		let response = this._responses[respondent.id]?.[question.id];
		if (!response) {
			throw Error('Asking to retrieve a response that does not exist yet.');
		}
		return response;
	}

	public hasResponse(question: SurveyViewQuestion, respondent: SurveyRespondent): boolean {
		if (this._responses[respondent.id]?.[question.id]) {
			return true;
		}
		return false;
	}

	/**
	 * Stores the passed response for the associated respondent and question/
	 * @param question
	 * @param respondent
	 * @param response
	 */
	public storeResponse(question: SurveyViewQuestion, respondent: SurveyRespondent, response: any): void {
		if (!this._responses[respondent.id]) {
			this._responses[respondent.id] = {};
		}
		this._responses[respondent.id] = response;
	}

	/**
	 * Preloads / retrieves a set of responses in bulk and stores them for later access.
	 * @param questionIds A list of question IDs to load responses for.
	 * @param respondent  The respondent to load respones for
	 */
	public loadResponses(questions: Array<SurveyViewQuestion>, respondent: SurveyRespondent): Observable<void> {
		let queryIds = [];
		for (let question of questions) {
			if (!this.hasResponse(question, respondent)) {
				queryIds.push(question.id);
			}
		}
		// if there are no ids to query, return immediately
		if (queryIds.length === 0) {
			return EMPTY;
		}
		return new Observable((obs) => {
			this._responseClient
				.listSurveyResponsesForQuestions(this._session.surveyId, queryIds, respondent.id)
				.subscribe({
					complete: () => {
						obs.complete();
					},
				});
		});
	}
}
