import { QuestionPartViewLabel } from './question-part-view-label.model';
import { QuestionPart } from './question-part.model';

export class QuestionPartView {
	constructor(
		public id?: number,
		public label?: QuestionPartViewLabel,
		public parentViewId?: number,
		public questionPartViewChildren?: QuestionPartView[],
		public order?: number,
		public questionPart?: QuestionPart,
		public isOptional?: boolean,
		public isHousehold?: boolean,
		public repeatSourceQuestionName?: string,
		public icon?: string
	) {}
}
