import { Observable } from 'rxjs';
import { ResponseTypes } from './public_api';
export abstract class SurveyResponder {
	id: number;

	abstract addSurveyGroupMember(respondent: SurveyRespondent): Observable<any>;
	abstract getSurveyGroupMembers(respondent: SurveyRespondent): Observable<any>;
	abstract removeSurveyGroupMember(respondent: SurveyRespondent): Observable<any>;
	abstract updateSurveyGroupMember(respondent: SurveyRespondent): Observable<any>;
	abstract listSurveyResponsesOfType(surveyId: number, type: ResponseTypes): Observable<any>;
	abstract listResponsesForQuestionsByName(questionNames: Array<string>, respondent: SurveyRespondent): Observable<any>;
	abstract getResponseValue(questionName: string, respondent: SurveyRespondent): any;
}

export interface SurveyRespondent {
	name: string;
	id: number;
	relationship: string;
}
