import {
	Component,
	OnInit,
	Input,
	ViewChild,
	AfterViewInit,
	EventEmitter,
	Output,
	ChangeDetectorRef
} from '@angular/core';
import {
	TreeviewItem,
	DownlineTreeviewItem,
	TreeviewEventParser,
	OrderDownlineTreeviewEventParser,
	DropdownTreeviewComponent,
	TreeviewSelection,
	TreeviewI18nDefault
} from 'ngx-treeview';
import { QuestionConditionalSourceGroup } from '../../../../models/question-conditional-source-group.model';
import { QuestionConditional } from '../../../../models/question-conditional.model';
import { QuestionOptionConditional } from '../../../../models/question-option-conditional.model';

@Component({
	selector: 'app-conditional',
	templateUrl: './conditional.component.html',
	styleUrls: ['./conditional.component.scss'],
	providers: [{ provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser }]
})
export class SourceConditionalComponent implements OnInit, AfterViewInit {
	public dropDownListItems: Array<string> = [];

	public treedropdownConfig = {
		hasAllCheckBox: false,
		hasFilter: false,
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

	public copiedOptionList: any[] = [];
	public sourceQuestionConditionalsList: QuestionConditional[] = [];
	public sourceQuestionOptionConditionalsList: QuestionOptionConditional[] = [];

	private checkedWithParents: DownlineTreeviewItem[] = [];

	@Input()
	public responseType: string;

	@Input()
	public questionType: string;

	@Input()
	public questionPartId: number;

	@Input()
	public sourceGroup: QuestionConditionalSourceGroup;

	@Input()
	public optionList: TreeviewItem[];

	@Output()
	public setBoundsSelected: EventEmitter<QuestionConditionalSourceGroup> = new EventEmitter<
		QuestionConditionalSourceGroup
	>();

	@ViewChild('optionTargets')
	public optionTargetsTreeDropdown: DropdownTreeviewComponent;

	public optionSelectValues: any[] = [];
	constructor(private changeDetectRef: ChangeDetectorRef) {}

	ngOnInit() {
		this.setConditionsForQuestionType();
		if (this.responseType === 'OptionList' || this.responseType === 'OptionSelect') {
			this.optionList.forEach(element => {
				let copiedItem = new TreeviewItem({
					value: element.value,
					text: element.text,
					checked: this.sourceGroup.value.includes(`"${element.value}"`)
				});
				this.copiedOptionList.push(copiedItem);
			});
		}
	}

	ngAfterViewInit() {
		this.optionTargetsTreeDropdown.i18n = new TreeviewI18nDefault();
		this.optionTargetsTreeDropdown.i18n.getText = e => this.targetsDropdown(e);
		this.changeDetectRef.detectChanges();
	}

	showBoundsModal() {
		this.setBoundsSelected.emit(this.sourceGroup);
	}

	targetsDropdown(e: TreeviewSelection) {
		if (e.checkedItems.length === 1) {
			return e.checkedItems[0].text;
		} else if (e.checkedItems.length > 1) {
			return this.getPrunedCheckedTargets().map(i => this.getQuestionOptionLabel(i)).join(', '); // `${e.checkedItems.length} targets`;
		} else {
			return 'Select hide targets';
		}
	}

	private getPrunedCheckedTargets(): TreeviewItem[] {
		let pruned: TreeviewItem[] = [];

		this.checkedWithParents.forEach(item => {
			if (item.parent && item.parent.item.checked) {
				if (!pruned.includes(item.parent.item)) {
					pruned.push(item.parent.item);
				}
			} else {
				pruned.push(item.item);
			}
		});
		return pruned;
	}

	private getQuestionOptionLabel(item: TreeviewItem) {
		let itemType = this.getItemType(item.value);
		if (itemType === 'question') {
			return `Q:${item.text}`;
		} else if (itemType === 'option') {
			return `O:${item.text}`;
		}
	}

	private setConditionsForQuestionType() {
		if (this.responseType === 'String') {
			this.dropDownListItems = ['Contains', 'Does Not Contain'];
		} else if (this.responseType === 'Boolean') {
			this.dropDownListItems = ['Is Equal To'];
		} else if (this.responseType === 'Integer') {
			this.dropDownListItems = ['Is Equal To', 'Is Not Equal To', 'Greater Than', 'Less Than'];
		} else if (this.responseType === 'Decimal') {
			this.dropDownListItems = ['Is Equal To', 'Is Not Equal To', 'Greater Than', 'Less Than'];
		} else if (this.responseType === 'Location') {
			this.dropDownListItems = ['In Bounds', 'Out Of Bounds'];
		} else if (this.responseType === 'Json') {
			this.dropDownListItems = ['Contains', 'Does Not Contain'];
		} else if (this.responseType === 'OptionSelect') {
			this.dropDownListItems = ['Is Equal To', 'Is Not Equal To'];
		} else if (this.responseType === 'OptionList') {
			this.dropDownListItems = ['Is Any Of', 'Is All Of'];
		} else if (this.responseType === 'DateTime') {
			this.dropDownListItems = ['In Range', 'Outside Range'];
		}
	}

	conditionValueChanged(e) {
		this.sourceGroup.condition = this.dropDownListItems.filter(dd => dd === e)[0];
		// update condition value in conditionals lists
		this.sourceQuestionConditionalsList.forEach(conditional => {
			conditional.condition = this.sourceGroup.condition;
		});
		this.sourceQuestionOptionConditionalsList.forEach(conditional => {
			conditional.condition = this.sourceGroup.condition;
		});
	}

	onSelectedChangeSingleOption($event) {
		this.updateConditionalsValues();
	}

	updateConditionalsValues() {
		this.sourceQuestionConditionalsList.forEach(conditional => {
			conditional.value = this.sourceGroup.value;
		});
		this.sourceQuestionOptionConditionalsList.forEach(conditional => {
			conditional.value = this.sourceGroup.value;
		});
	}

	onSelectedChangeTargets(downlineItems: DownlineTreeviewItem[]) {
		this.checkedWithParents = downlineItems;
		let priorSourceQuestionConditionals = this.sourceQuestionConditionalsList;
		let priorSourceQuestionOptionConditionals = this.sourceQuestionOptionConditionalsList;
		this.sourceQuestionConditionalsList = [];
		this.sourceQuestionOptionConditionalsList = [];

		downlineItems.forEach(selectedTarget => {
			// if option, add only if parent question is unchecked
			if ((<string>selectedTarget.item.value).startsWith('option')) {
				if (!selectedTarget.parent.item.checked) {
					let id = +(selectedTarget.item.value.split('-')[1]);
					let parentId = +(selectedTarget.parent.item.value.split('-')[1]);
					let existing: QuestionOptionConditional = priorSourceQuestionOptionConditionals.filter(
						o => o.targetOptionId === id
					)[0];
					if (existing) {
						this.sourceQuestionOptionConditionalsList.push(existing);
					} else {
						let newOptionConditional: QuestionOptionConditional = new QuestionOptionConditional(
							0,
							id,
							parentId,
							this.questionPartId,
							this.sourceGroup.condition,
							this.sourceGroup.value
						);
						this.sourceQuestionOptionConditionalsList.push(newOptionConditional);
					}
				} else {
					let idSplit = selectedTarget.parent.item.value.split('-');
					let id = +idSplit[1];
					let existingPrevious: QuestionConditional = priorSourceQuestionConditionals.filter(
						o => o.targetQuestionId === id
					)[0];
					let existingAlready: QuestionConditional = this.sourceQuestionConditionalsList.filter(
						o => o.targetQuestionId === id
					)[0];
					if (existingAlready === undefined) {
						if (existingPrevious) {
							this.sourceQuestionConditionalsList.push(existingPrevious);
						} else {
							let newConditional: QuestionConditional = new QuestionConditional(
								0,
								id,
								this.questionPartId,
								this.sourceGroup.condition,
								this.sourceGroup.value
							);
							this.sourceQuestionConditionalsList.push(newConditional);
						}
					}
				}
			} else if ((<string>selectedTarget.item.value).startsWith('question')) {
				// if question, always add, after searching for existing
				let idSplit = selectedTarget.item.value.split('-');
				let id = +(idSplit[1]);
				let existing: QuestionConditional = priorSourceQuestionConditionals.filter(
					o => o.targetQuestionId === id
				)[0];
				if (existing) {
					this.sourceQuestionConditionalsList.push(existing);
				} else {
					let newConditional: QuestionConditional = new QuestionConditional(
						0,
						id,
						this.questionPartId,
						this.sourceGroup.condition,
						this.sourceGroup.value
					);
					this.sourceQuestionConditionalsList.push(newConditional);
				}
			}
		});
	}

	onSelectedChangeOptions(downlineItems: DownlineTreeviewItem[]) {
		this.sourceGroup.value = JSON.stringify(downlineItems.map(i => i.item.value));
		this.sourceQuestionConditionalsList.forEach(conditional => {
			conditional.value = this.sourceGroup.value;
		});
		this.sourceQuestionOptionConditionalsList.forEach(conditional => {
			conditional.value = this.sourceGroup.value;
		});
	}

	// property conversions based on type

	public getItemType(value: string) {
		return value.split('-')[0];
	}

	get booleanValue(): boolean {
		return this.sourceGroup.value === 'true';
	}
	set booleanValue(value: boolean) {
		if (value === true) {
			this.sourceGroup.value = 'true';
		} else {
			this.sourceGroup.value = 'false';
		}
	}

	get numberValue(): number {
		return +this.sourceGroup.value;
	}
	set numberValue(value: number) {
		this.sourceGroup.value = `${value}`;
	}

	get optionSelectValue() {
		return this.sourceGroup.value;
	}
	set optionSelectValue(value: any) {
		this.sourceGroup.value = value;
	}
}
