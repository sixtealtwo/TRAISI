import { Observable } from 'rxjs';
import { SurveyRespondent } from './survey-respondent.model';
import { ResponseTypes, ResponseData } from './survey-question';
export abstract class SurveyResponseService {
	id: number;
	abstract listSurveyResponsesOfType(surveyId: number, type: ResponseTypes): Observable<any>;
	abstract getResponseValue(questionName: string, respondent: SurveyRespondent): Array<ResponseData<ResponseTypes>>;
}
