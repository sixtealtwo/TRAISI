import { QuestionConfigurationValue } from './question-configuration-value';

export class QuestionPart {
	constructor(
		public id?: number,
		public questionType?: string,
		public isGroupQuestion?: boolean,
		public questionPartChildren?: QuestionPart[],
		public questionConfigurations?: QuestionConfigurationValue[]
	) {}
}
