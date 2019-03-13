import { Observable } from 'rxjs';
import { ResponseTypes } from '.';

export interface SurveyResponder {
	id: number;

	addSurveyGroupMember(respondent: SurveyRespondent): Observable<{}>;
	getSurveyGroupMembers(respondent: SurveyRespondent): Observable<{}>;
	removeSurveyGroupMember(respondent: SurveyRespondent): Observable<{}>;
	updateSurveyGroupMember(respondent: SurveyRespondent): Observable<{}>;
	listSurveyResponsesOfType(surveyId: number, type: ResponseTypes): Observable<any>;
	preparePreviousSurveyResponses(respondent: SurveyRespondent): Observable<{}>;
}

export interface SurveyRespondent {
	name: string;
	id: number;
	relationship: string;
}
