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
	TreeviewI18nDefault,
	TreeviewConfig
} from 'ngx-treeview';
import { QuestionConditionalSourceGroup } from '../../../../models/question-conditional-source-group.model';
import { QuestionConditional } from '../../../../models/question-conditional.model';
import { QuestionOptionConditional } from '../../../../models/question-option-conditional.model';
import { BsDaterangepickerConfig } from 'ngx-bootstrap';
import { QuestionOptionValue } from '../../../../models/question-option-value.model';

interface ConditionalOptionItem {
	name: string;
	code: string;
}

@Component({
	selector: 'app-conditional',
	templateUrl: './conditional.component.html',
	styleUrls: ['./conditional.component.scss'],
	providers: [{ provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser }]
})
export class SourceConditionalComponent implements OnInit, AfterViewInit {
	public dropDownListItems: Array<string> = [];

	public treedropdownConfig: TreeviewConfig = {
		hasAllCheckBox: false,
		hasFilter: false,
		hasDivider: false,
		hasCollapseExpand: false,
		decoupleChildFromParent: false,
		maxHeight: 500
	};

	public treedropdownSingleConfig: TreeviewConfig = {
		hasAllCheckBox: false,
		hasFilter: false,
		hasDivider: false,
		hasCollapseExpand: false,
		decoupleChildFromParent: false,
		maxHeight: 500
	};

	public bsConfig: Partial<BsDaterangepickerConfig> = Object.assign(
		{},
		{
			containerClass: 'theme-default',
			dateInputFormat: 'YYYY-MM-DD'
		}
	);

	public copiedOptionList: any[] = [];
	public sourceQuestionConditionalsList: QuestionConditional[] = [];
	public sourceQuestionOptionConditionalsList: QuestionOptionConditional[] = [];

	private checkedWithParents: DownlineTreeviewItem[] = [];

	public dateRange: Date[] = [];

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

	@Input()
	public questionOptions: Map<string, QuestionOptionValue[]> = new Map<string, QuestionOptionValue[]>();

	@Output()
	public setBoundsSelected: EventEmitter<QuestionConditionalSourceGroup> = new EventEmitter<
		QuestionConditionalSourceGroup
	>();

	@ViewChild('optionTargets')
	public optionTargetsTreeDropdown: DropdownTreeviewComponent;

	public optionSelectValues: any[] = [];
	constructor(private changeDetectRef: ChangeDetectorRef) {}

	public ngOnInit(): void {
		this.setConditionsForQuestionType();
		if (this.sourceGroup.condition === '') {
			this.sourceGroup.condition = this.dropDownListItems[0];
		}
		if (this.responseType === 'OptionList' || this.responseType === 'OptionSelect') {
			this.optionList.forEach(element => {
				let valueSplit: string[] = element.value.split('~');	// [0] - 'option', [1] - option group name, [2] - option id
				let codeFromId = this.questionOptions.get(valueSplit[1]).filter(o => o.id === +valueSplit[2])[0].code;
				let valueCheck = `"name":"${valueSplit[1]}","code":"${codeFromId}"`;
				let copiedItem = new TreeviewItem({
					value: element.value,
					text: element.text,
					checked: this.sourceGroup.value.includes(valueCheck)
				});
				this.copiedOptionList.push(copiedItem);
			});
		} else if (this.responseType === 'DateTime') {
			this.dateRange = JSON.parse(this.sourceGroup.value);
		}
	}

	public ngAfterViewInit(): void {
		this.optionTargetsTreeDropdown.i18n = new TreeviewI18nDefault();
		this.optionTargetsTreeDropdown.i18n.getText = e => this.targetsDropdown(e);
		this.changeDetectRef.detectChanges();
	}

	public showBoundsModal(): void {
		this.setBoundsSelected.emit(this.sourceGroup);
	}

	private targetsDropdown(e: TreeviewSelection): string {
		if (e.checkedItems.length > 0) {
			return this.getPrunedCheckedTargets().map(i => this.getQuestionOptionLabel(i)).join(', '); // `${e.checkedItems.length} targets`;
		} else {
			return 'Select hide targets';
		}
	}

	private getPrunedCheckedTargets(): TreeviewItem[] {
		let pruned: TreeviewItem[] = [];

		this.checkedWithParents.forEach(item => {
			if (item.parent && item.parent.item.checked && !item.parent.item.value.startsWith('part')) {
				if (!pruned.includes(item.parent.item)) {
					pruned.push(item.parent.item);
				}
			} else {
				pruned.push(item.item);
			}
		});
		return pruned;
	}

	private getQuestionOptionLabel(item: TreeviewItem): string {
		let itemType = this.getItemType(item.value);
		if (itemType === 'question') {
			return `Q:${item.text}`;
		} else if (itemType === 'option') {
			return `O:${item.text}`;
		}
	}

	private setConditionsForQuestionType(): void {
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

	public conditionValueChanged(e: string): void {
		this.sourceGroup.condition = this.dropDownListItems.filter(dd => dd === e)[0];
		// update condition value in conditionals lists
		this.sourceQuestionConditionalsList.forEach(conditional => {
			conditional.condition = this.sourceGroup.condition;
		});
		this.sourceQuestionOptionConditionalsList.forEach(conditional => {
			conditional.condition = this.sourceGroup.condition;
		});
	}


	public updateConditionalsValues(): void {
		this.sourceQuestionConditionalsList.forEach(conditional => {
			conditional.value = this.sourceGroup.value;
		});
		this.sourceQuestionOptionConditionalsList.forEach(conditional => {
			conditional.value = this.sourceGroup.value;
		});
	}

	public onSelectedChangeTargets(downlineItems: DownlineTreeviewItem[]): void {
		this.checkedWithParents = downlineItems;
		let priorSourceQuestionConditionals = this.sourceQuestionConditionalsList;
		let priorSourceQuestionOptionConditionals = this.sourceQuestionOptionConditionalsList;
		this.sourceQuestionConditionalsList = [];
		this.sourceQuestionOptionConditionalsList = [];

		downlineItems.forEach(selectedTarget => {
			// if option, add only if parent question is unchecked
			if ((<string>selectedTarget.item.value).startsWith('option')) {
				if (!selectedTarget.parent.item.checked) {
					let id = +(selectedTarget.item.value.split('~')[2]);
					let existing: QuestionOptionConditional = priorSourceQuestionOptionConditionals.filter(
						o => o.targetOptionId === id
					)[0];
					if (existing) {
						this.sourceQuestionOptionConditionalsList.push(existing);
					} else {
						let newOptionConditional: QuestionOptionConditional = new QuestionOptionConditional(
							0,
							id,
							this.questionPartId,
							this.sourceGroup.condition,
							this.sourceGroup.value
						);
						this.sourceQuestionOptionConditionalsList.push(newOptionConditional);
					}
				} else {
					let idSplit = selectedTarget.parent.item.value.split('~');
					let id = +idSplit[2];
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
				let idSplit = selectedTarget.item.value.split('~');
				let id = +(idSplit[2]);
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

	public onSelectedChangeOptions(downlineItems: DownlineTreeviewItem[]): void {
		// split value into json structure and stringify
		let valueStructure: Object = {};
		this.sourceGroup.value = JSON.stringify(downlineItems.map(i => {
			let split: string[] = i.item.value.split('~');  // [0] - 'option', [1] - option group name, [2] - option id
			let codeFromId = this.questionOptions.get(split[1]).filter(o => o.id === +split[2])[0].code;
			let conditionalOptionSelect: ConditionalOptionItem = {
				name: split[1],
				code: codeFromId
			};
			return conditionalOptionSelect;
		}));
		this.sourceQuestionConditionalsList.forEach(conditional => {
			conditional.value = this.sourceGroup.value;
		});
		this.sourceQuestionOptionConditionalsList.forEach(conditional => {
			conditional.value = this.sourceGroup.value;
		});
	}

	// property conversions based on type

	public getItemType(value: string): string {
		return value.split('~')[0];
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

	get optionSelectValue(): any {
		return this.sourceGroup.value;
	}
	set optionSelectValue(value: any) {
		this.sourceGroup.value = value;
	}

	public onDateChange(newRange: Date[]): void {
		this.sourceGroup.value = JSON.stringify(newRange);
	}

}
