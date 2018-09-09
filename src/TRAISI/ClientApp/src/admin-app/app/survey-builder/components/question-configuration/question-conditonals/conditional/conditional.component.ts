import { Component, OnInit, Input, ViewChild, AfterViewInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
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

@Component({
	selector: 'app-conditional',
	templateUrl: './conditional.component.html',
	styleUrls: ['./conditional.component.scss'],
	providers: [{ provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser }]
})
export class ConditionalComponent implements OnInit, AfterViewInit {
	public dropDownListSelectedId: string;
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

	@Input()
	public responseType: string;

	@Input()
	public questionType: string;

	@Input()
	public sourceGroup: QuestionConditionalSourceGroup;

	@Input()
	public optionList: TreeviewItem[];

	@Output()
	public setBoundsSelected: EventEmitter<QuestionConditionalSourceGroup> = new EventEmitter<QuestionConditionalSourceGroup>();

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
					checked: false
				});
				this.copiedOptionList.push(copiedItem);
			});
		}
	}

	ngAfterViewInit() {
		this.optionTargetsTreeDropdown.i18n = new TreeviewI18nDefault();
		this.optionTargetsTreeDropdown.i18n.getText = (e) => this.targetsDropdown(e);
		this.changeDetectRef.detectChanges();
	}

	showBoundsModal() {
		this.setBoundsSelected.emit(this.sourceGroup);
	}

	targetsDropdown(e: TreeviewSelection) {
		if (e.checkedItems.length === 1) {
			return e.checkedItems[0].text;
		} else if (e.checkedItems.length > 1) {
			return `${e.checkedItems.length} targets`;
		} else {
			return 'Select hide targets';
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
			this.dropDownListItems = ['In Bounds', 'Out of Bounds'];
		} else if (this.responseType === 'Json') {
			this.dropDownListItems = ['Contains', 'Does Not Contain'];
		} else if (this.responseType === 'OptionSelect') {
			this.dropDownListItems = ['Is Equal To', 'Is Not Equal To'];
		}	else if (this.responseType === 'OptionList') {
			this.dropDownListItems = ['Is Any Of', 'Is All Of'];
		} else if (this.responseType === 'DateTime') {
			this.dropDownListItems = ['In Range', 'Outside Range'];
		}
	}

	valueChanged(e) {
		this.dropDownListSelectedId = this.dropDownListItems.filter(dd => dd === e)[0];
	}

	onSelectedChange(downlineItems: DownlineTreeviewItem[]) {}

	onSelectedChangeOptions(downlineItems: DownlineTreeviewItem[]) {}

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
