export class SurveyQuestionOptionStructure {
	constructor(
		public id?: number,
		public label?: string,
		public type?: string,
		public children?: SurveyQuestionOptionStructure[]
	) {}
}
