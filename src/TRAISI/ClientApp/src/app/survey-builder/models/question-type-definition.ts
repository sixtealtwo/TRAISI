import { QuestionIconType } from './question-icon-type.enum';

export interface QuestionTypeDefinition {
	id: number;
	typeName: string;
	icon: string;
	iconType: QuestionIconType;
	questionConfigurations: any[];
}
