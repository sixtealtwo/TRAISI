import { QuestionTypeIcon } from './question-type-icon';

export interface QuestionTypeDefinition {
	id: number;
	typeName: string;
	icon: string;
	iconType: QuestionTypeIcon;
}
