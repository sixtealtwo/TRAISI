import { QuestionOptionLabel } from './question-option-label.model';
import { TreeviewItem } from 'ngx-treeview';

export class QuestionConditionalTargetGroup {
	constructor(
		public source?: TreeviewItem[],
		public condition?: string,
		public value?: string,
		public targets?: TreeviewItem[]
	) {}
}
