import { QuestionIconType } from './question-icon-type.enum';
import { QuestionOptionDefinition } from './question-option-definition.model';
import { QuestionConfigurationDefinition } from './question-configuration-definition.model';

export interface QuestionTypeDefinition {
	typeName: string;
	icon: string;
	questionOptions: QuestionOptionDefinition[];
	questionConfigurations: QuestionConfigurationDefinition[];
	responseType: string;
}
