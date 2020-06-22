import { Observable } from 'rxjs';
import { SurveyRespondent } from './survey-respondent.model';
import { ResponseTypes, ResponseData, QuestionResponseType } from './survey-question';
export abstract class SurveyResponseService {
	id: number;
	abstract listSurveyResponsesOfType(surveyId: number, type: QuestionResponseType): Observable<any>;
	abstract getResponseValue(questionName: string, respondent: SurveyRespondent): Array<ResponseData<ResponseTypes>>;
}
