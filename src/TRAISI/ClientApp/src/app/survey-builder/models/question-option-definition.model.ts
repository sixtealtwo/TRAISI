import { QuestionIconType } from './question-icon-type.enum';

export interface QuestionOptionDefinition {
	name: string;
	description: string;
	valueType: string;
	defaultValue: string;
	isMultipleAllowed: boolean;
}
