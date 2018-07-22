import { QuestionPartView } from './question-part-view.model';
import { TermsAndConditionsPage } from './terms-and-condiitions-page.model';
import { WelcomePage } from './welcome-page.model';
import { ThankYouPage } from './thank-you-page.model';

export class SurveyViewStructure {
	constructor(
		public id?: number,
		public surveyId?: number,
		public viewName?: string,
		public pages?: QuestionPartView[],
		public termsAndConditionsPage?: TermsAndConditionsPage,
		public welcomePage?: WelcomePage,
		public surveyCompletionPage?: ThankYouPage) {	}
}
