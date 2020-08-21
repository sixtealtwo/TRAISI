import { SurveyViewerSession } from 'app/services/survey-viewer-session.service';
import { Provider } from '@angular/core';
import { TraisiValues } from 'traisi-question-sdk';

export const surveyIdProviderFactory = (session: SurveyViewerSession): number => {
	console.log('in here ');
	return session.surveyId;
};

export const SurveyViewerProviders: Provider[] = [
	{
		provide: TraisiValues.SurveyId,
		useFactory: surveyIdProviderFactory,
		deps: [SurveyViewerSession],
	},
];
