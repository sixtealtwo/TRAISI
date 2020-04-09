import { SurveyViewQuestion } from './survey-view-question.model';
import { QuestionConditionalType } from './question-conditional-type.enum';


export class QuestionConditional {
	constructor(
		public id?: number,
		public targetQuestionId?: number,
		public sourceQuestionId?: number,
		public condition?: QuestionConditionalType,
		public sourceQuestion?: SurveyViewQuestion,
		public value?: string
	) {}
}
