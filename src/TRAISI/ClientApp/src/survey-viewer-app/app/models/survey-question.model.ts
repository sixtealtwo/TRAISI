export interface SurveyQuestion {
	configuration: object | Array<any> | any;
	id: number;
	isOptional: boolean;
	isRepeat: boolean;
	label: string;
	order: number;
	questionId: number;
	questionType: string;
}
