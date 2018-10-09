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
import { BsDaterangepickerConfig } from 'ngx-bootstrap';
import { QuestionConditionalTargetGroup } from '../../../../models/question-conditional-target-group.model';
import { QuestionTypeDefinition } from '../../../../models/question-type-definition';
import { SurveyBuilderService } from '../../../../services/survey-builder.service';

@Component({
	selector: 'app-target-conditional',
	templateUrl: './target-conditional.component.html',
	styleUrls: ['./target-conditional.component.scss']
})
export class TargetConditionalComponent implements OnInit, AfterViewInit {
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

	public bsConfig: Partial<BsDaterangepickerConfig> = Object.assign(
		{},
		{
			containerClass: 'theme-default',
			dateInputFormat: 'YYYY-MM-DD'
		}
	);

	public copiedOptionList: any[] = [];
	public targetQuestionConditionalsList: QuestionConditional[] = [];
	public targetQuestionOptionConditionalsList: QuestionOptionConditional[] = [];

	private checkedWithParents: DownlineTreeviewItem[] = [];

	public dateRange: Date[] = [];

	public selectedSourceQuestion: string;

	private questionTypeDefinitions: Map<string, QuestionTypeDefinition> = new Map<string, QuestionTypeDefinition>();

	public responseType: string;

	@Input()
	public questionType: string;

	@Input()
	public questionPartId: number;

	@Input()
	public targetGroup: QuestionConditionalTargetGroup;

	@Input()
	public optionList: TreeviewItem[];

	@Input()
	public questionsBefore: TreeviewItem[];

	@Output()
	public setBoundsSelected: EventEmitter<QuestionConditionalTargetGroup> = new EventEmitter<
		QuestionConditionalTargetGroup
	>();

	@ViewChild('optionTargets')
	public optionTargetsTreeDropdown: DropdownTreeviewComponent;

	public optionSelectValues: any[] = [];
	constructor(private changeDetectRef: ChangeDetectorRef, private builderService: SurveyBuilderService) {

		builderService.questionTypeDefinitions.forEach(qType => {
			this.questionTypeDefinitions.set(qType.typeName, qType);
		});
	}

	ngOnInit() {
		this.setConditionsForQuestionType();
		if (this.targetGroup.condition === '') {
			this.targetGroup.condition = this.dropDownListItems[0];
		}
		if (this.responseType === 'OptionList' || this.responseType === 'OptionSelect') {
			this.optionList.forEach(element => {
				let copiedItem = new TreeviewItem({
					value: element.value,
					text: element.text,
					checked: this.targetGroup.value.includes(`"${element.value}"`)
				});
				this.copiedOptionList.push(copiedItem);
			});
		} else if (this.responseType === 'DateTime') {
			this.dateRange = JSON.parse(this.targetGroup.value);
		}
	}

	ngAfterViewInit() {
		this.optionTargetsTreeDropdown.i18n = new TreeviewI18nDefault();
		this.optionTargetsTreeDropdown.i18n.getText = e => this.targetsDropdown(e);
		this.changeDetectRef.detectChanges();
	}

	showBoundsModal() {
		this.setBoundsSelected.emit(this.targetGroup);
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
		this.targetGroup.condition = this.dropDownListItems.filter(dd => dd === e)[0];
		// update condition value in conditionals lists
		this.targetQuestionConditionalsList.forEach(conditional => {
			conditional.condition = this.targetGroup.condition;
		});
		this.targetQuestionOptionConditionalsList.forEach(conditional => {
			conditional.condition = this.targetGroup.condition;
		});
	}

	updateConditionalsValues() {
		this.targetQuestionConditionalsList.forEach(conditional => {
			conditional.value = this.targetGroup.value;
		});
		this.targetQuestionOptionConditionalsList.forEach(conditional => {
			conditional.value = this.targetGroup.value;
		});
	}

	onSelectedChangeTargets(downlineItems: DownlineTreeviewItem[]) {
		this.checkedWithParents = downlineItems;
		let priorTargetQuestionConditionals = this.targetQuestionConditionalsList;
		let priorTargetQuestionOptionConditionals = this.targetQuestionOptionConditionalsList;
		this.targetQuestionConditionalsList = [];
		this.targetQuestionOptionConditionalsList = [];

		let selectedSourceId: number;

		if (this.selectedSourceQuestion) {
			selectedSourceId = +(this.selectedSourceQuestion.split('|')[1]);
		} else {
			selectedSourceId = -1;
		}

		downlineItems.forEach(selectedTarget => {
			// if option, add only if parent question is unchecked
			if (!selectedTarget.parent.item.checked) {
				let id = +(selectedTarget.item.value.split('|')[1]);

				let existing: QuestionOptionConditional = priorTargetQuestionOptionConditionals.filter(
					o => o.targetOptionId === id
				)[0];
				if (existing) {
					this.targetQuestionOptionConditionalsList.push(existing);
				} else {
					let newOptionConditional: QuestionOptionConditional = new QuestionOptionConditional(
						0,
						id,
						selectedSourceId,
						this.targetGroup.condition,
						this.targetGroup.value
					);
					this.targetQuestionOptionConditionalsList.push(newOptionConditional);
				}
			} else {
				let idSplit = selectedTarget.parent.item.value.split('|');
				let id = +idSplit[1];
				let existingPrevious: QuestionConditional = priorTargetQuestionConditionals.filter(
					o => o.targetQuestionId === id
				)[0];
				let existingAlready: QuestionConditional = this.targetQuestionConditionalsList.filter(
					o => o.targetQuestionId === id
				)[0];
				if (existingAlready === undefined) {
					if (existingPrevious) {
						this.targetQuestionConditionalsList.push(existingPrevious);
					} else {
						let newConditional: QuestionConditional = new QuestionConditional(
							0,
							id,
							selectedSourceId,
							this.targetGroup.condition,
							this.targetGroup.value
						);
						this.targetQuestionConditionalsList.push(newConditional);
					}
				}
			}
		});
	}

	onSelectedChangeOptions(downlineItems: DownlineTreeviewItem[]) {
		this.targetGroup.value = JSON.stringify(downlineItems.map(i => i.item.value));
		this.targetQuestionConditionalsList.forEach(conditional => {
			conditional.value = this.targetGroup.value;
		});
		this.targetQuestionOptionConditionalsList.forEach(conditional => {
			conditional.value = this.targetGroup.value;
		});
	}


	// property conversions based on type

	public getItemType(value: string) {
		return value.split('|')[0];
	}

	get booleanValue(): boolean {
		return this.targetGroup.value === 'true';
	}
	set booleanValue(value: boolean) {
		if (value === true) {
			this.targetGroup.value = 'true';
		} else {
			this.targetGroup.value = 'false';
		}
	}

	get numberValue(): number {
		return +this.targetGroup.value;
	}
	set numberValue(value: number) {
		this.targetGroup.value = `${value}`;
	}

	get optionSelectValue() {
		return this.targetGroup.value;
	}
	set optionSelectValue(value: any) {
		this.targetGroup.value = value;
	}

	public onDateChange(newRange: Date[]) {
		this.targetGroup.value = JSON.stringify(newRange);
	}

}
