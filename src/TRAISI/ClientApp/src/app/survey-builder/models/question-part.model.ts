import { QuestionPartViewLabel } from './question-part-view-label.model';

export class QuestionPart {
	constructor(
		public id?: number,
		public questionType?: string,
		public isGroupQuestion?: boolean
	) {}
}
