import { QuestionOptionLabel } from './question-option-label.model';

export class QuestionConditional {
	constructor(
		public id?: number,
		public targetQuestionId?: number,
		public sourceQuestionId?: number,
		public condition?: string,
		public value?: string
	) {}
}
