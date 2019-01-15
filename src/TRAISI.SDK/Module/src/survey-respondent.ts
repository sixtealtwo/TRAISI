import { Observable } from 'rxjs';
import { ResponseTypes } from '.';

export interface SurveyResponder {
	id: number;

	addSurveyGroupMember(respondent: SurveyRespondent): Observable<{}>;
	getSurveyGroupMembers(): Observable<{}>;
	removeSurveyGroupMember(respondent: SurveyRespondent): Observable<{}>;
	updateSurveyGroupMember(respondent: SurveyRespondent): Observable<{}>;
	listSurveyResponsesOfType(surveyId: number, type: ResponseTypes): Observable<any>;
}

export interface SurveyRespondent {
	name: string;
	id: number;
	relationship: string;
}

/*
        String,
        Boolean,
        Integer,
        Decimal,
        Location,
        Json,
        OptionList,
        DateTime
 */
