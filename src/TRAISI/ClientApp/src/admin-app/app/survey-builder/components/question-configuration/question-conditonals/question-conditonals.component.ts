import { Component, OnInit, Input } from '@angular/core';
import {
	TreeviewItem,
	DownlineTreeviewItem,
	TreeviewEventParser,
	OrderDownlineTreeviewEventParser
} from 'ngx-treeview';
import { QuestionConditionalSourceGroup } from '../../../models/question-conditional-source-group.model';
import { QuestionConditionalTargetGroup } from '../../../models/question-conditional-target-group.model';
import { QuestionTypeDefinition } from '../../../models/question-type-definition';
import { QuestionPartView } from '../../../models/question-part-view.model';

@Component({
	selector: 'app-question-conditonals',
	templateUrl: './question-conditonals.component.html',
	styleUrls: ['./question-conditonals.component.scss'],
	providers: [{ provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser }]
})
export class QuestionConditonalsComponent implements OnInit {
	public treedropdownConfig = {
		hasAllCheckBox: false,
		hasFilter: true,
		hasCollapseExpand: false,
		decoupleChildFromParent: false,
		maxHeight: 500
	};

	public treedropdownSingleConfig = {
		hasAllCheckBox: false,
		hasFilter: false,
		hasCollapseExpand: false,
		decoupleChildFromParent: false,
		maxHeight: 500
	};

	public sourceConditionals: QuestionConditionalSourceGroup[] = [];
	public targetConditionals: QuestionConditionalTargetGroup[] = [];

	@Input()
	public questionType: QuestionTypeDefinition;
	@Input()
	public questionBeingEdited: QuestionPartView;

	@Input()
	public questionOptionsAfter: TreeviewItem[] = [];
	@Input()
	public questionsBefore: TreeviewItem[] = [];
	@Input()
	public thisQuestion: TreeviewItem[] = [];

	constructor() {}

	ngOnInit() {}

	public addSourceConditional() {
		let newSourceGroup: QuestionConditionalSourceGroup = new QuestionConditionalSourceGroup(
			this.sourceConditionals.length,
			'',
			this.getDefaultValue(),
			this.cloneTargetList(this.questionOptionsAfter)
		);
		this.sourceConditionals.push(newSourceGroup);
	}

	public deleteSourceConditional(i: number) {
		this.sourceConditionals.splice(i, 1);
	}

	private getDefaultValue(): string {
		let responseValue: string;
		if (this.questionType.responseType === 'String') {
			responseValue = '';
		} else if (this.questionType.responseType === 'Boolean') {
			responseValue = 'false';
		} else if (this.questionType.responseType === 'Integer') {
			responseValue = '0';
		} else if (this.questionType.responseType === 'Decimal') {
			responseValue = '0.0';
		} else if (this.questionType.responseType === 'Location') {
			responseValue = null;
		} else if (this.questionType.responseType === 'Json') {
			responseValue = null;
		} else if (this.questionType.responseType === 'OptionList') {
			responseValue = '';
		} else if (this.questionType.responseType === 'DateTime') {
			responseValue = '';
		}
		return responseValue;
	}

	private cloneTargetList(parentList: TreeviewItem[]): TreeviewItem[] {
		if (parentList === undefined) {
			return undefined;
		}
		let tree: TreeviewItem[] = [];
		for (let treeItem of parentList) {
			let treeItemCopy = new TreeviewItem({
				value: treeItem.value,
				text: treeItem.text,
				checked: false,
				children: this.cloneTargetList(treeItem.children)
			});
			tree.push(treeItemCopy);
		}
		return tree;
	}


	onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
		console.log(downlineItems);
	}
}
