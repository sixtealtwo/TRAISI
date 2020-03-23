import { QuestionOptionLabel } from './question-option-label.model';
import { SBPageStructureViewModel } from '../services/survey-builder-client.service';
import { QuestionPartView } from './question-part-view.model';

export class QuestionConditional {
	constructor(
		public id?: number,
		public targetQuestionId?: number,
		public sourceQuestionId?: number,
		public condition?: string,
		public sourceQuestion?: QuestionPartView,
		public value?: string
	) {}
}
