import { Observable } from 'rxjs';
import { ResponseTypes } from './public_api';

export interface SurveyResponder {
	id: number;

	addSurveyGroupMember(respondent: SurveyRespondent): Observable<{}>;
	getSurveyGroupMembers(respondent: SurveyRespondent): Observable<{}>;
	removeSurveyGroupMember(respondent: SurveyRespondent): Observable<{}>;
	updateSurveyGroupMember(respondent: SurveyRespondent): Observable<{}>;
	listSurveyResponsesOfType(surveyId: number, type: ResponseTypes): Observable<any>;
	listResponsesForQuestionsByName(questionNames: Array<string>, respondent: SurveyRespondent): Observable<any>;

	getResponseValue(questionName: string, respondent: SurveyRespondent): any;
}

export interface SurveyRespondent {
	name: string;
	id: number;
	relationship: string;
}
