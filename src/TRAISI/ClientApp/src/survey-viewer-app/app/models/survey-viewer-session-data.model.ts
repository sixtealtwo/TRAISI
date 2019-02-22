import { SurveyRespondent } from 'traisi-question-sdk';

/**
 *
 *
 * @export
 * @interface SurveyViewerSessionData
 */
export interface SurveyViewerSessionData {
	surveyId: number;
	surveyName: string;
	shortcode: string;
	groupcode: string;
	primaryRespondent: SurveyRespondent;
}
