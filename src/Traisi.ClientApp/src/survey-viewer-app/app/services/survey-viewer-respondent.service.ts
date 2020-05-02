import { Injectable } from '@angular/core';
import { SurveyRespondent, SurveyQuestion } from 'traisi-question-sdk';
import { SurveyViewQuestion } from 'app/models/survey-view-question.model';
import { Observable, EMPTY } from 'rxjs';
import { SurveyResponseClient, SurveyRespondentClient } from './survey-viewer-api-client.service';
import { SurveyViewerSession } from './survey-viewer-session.service';

@Injectable({
	providedIn: 'root',
})
export class SurveyViewerRespondentService {
	public constructor(private _respondentClient: SurveyRespondentClient, private _session: SurveyViewerSession) {}

	public getSurveyPrimaryRespondent(surveyId: number): Observable<any> {
		return this._respondentClient.getSurveyPrimaryRespondent(surveyId);
	}

	/**
	 *
	 *
	 * @param {SurveyRespondent} respondent
	 * @returns {Observable<{}>}
	 * @memberof SurveyResponderService
	 */
	public addSurveyGroupMember(respondent: SurveyRespondent): Observable<number> {
		return this._respondentClient.addSurveyGroupMember(respondent);
	}

	/**
	 *
	 *
	 * @param {number} respondentId
	 * @returns {Observable<{}>}
	 * @memberof SurveyResponderService
	 */
	public getSurveyGroupMembers(respondent: SurveyRespondent): Observable<SurveyRespondent[]> {
		return this._respondentClient.listSurveyGroupMembers(respondent.id);
	}

	/**
	 *
	 * @param respondent
	 */
	public removeSurveyGroupMember(respondent: SurveyRespondent): Observable<void> {
		return this._respondentClient.removeSurveyGroupMember(respondent.id);
	}

	/**
	 *
	 * @param respondent
	 */
	public updateSurveyGroupMember(respondent: SurveyRespondent): Observable<void> {
		return this._respondentClient.updateSurveyGroupMember(respondent);
	}
}
