import { QuestionOptionLabel } from './question-option-label.model';

export class QuestionOptionValue {
	constructor(
		public id?: number,
		public name?: string,
		public optionLabel?: QuestionOptionLabel,
		public description?: string,
		public order?: number
	) {}
}
