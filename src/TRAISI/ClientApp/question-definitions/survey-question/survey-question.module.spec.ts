import { SurveyQuestionModule } from './survey-question.module';

describe('SurveyQuestionModule', () => {
	let surveyQuestionModule: SurveyQuestionModule;

	beforeEach(() => {
		surveyQuestionModule = new SurveyQuestionModule();
	});

	it('should create an instance', () => {
		expect(surveyQuestionModule).toBeTruthy();
	});
});
