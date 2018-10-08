import { Component, OnInit } from '@angular/core';
import { QuestionConfigurationDefinition } from '../../../models/question-configuration-definition.model';
import { Select2OptionData } from 'ng2-select2';

@Component({
	selector: 'app-multi-select',
	templateUrl: './multi-select.component.html',
	styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {
	public id: number;
	public questionConfiguration: QuestionConfigurationDefinition;

	options: Select2OptionData[] = [];
	selected: string[] = [];

	select2Options: any = {
		theme: 'bootstrap',
		multiple: true
	};
	public multiSelectValues: string;

	constructor() {}

	ngOnInit() {
		let optionData = JSON.parse(this.questionConfiguration.resourceData);
		optionData.options.forEach(element => {
			this.options.push({ text: element, id: element });
		});
		this.setDefaultValue();
	}

	setDefaultValue() {
		this.multiSelectValues = this.questionConfiguration.defaultValue;
		this.selected.push(this.questionConfiguration.defaultValue);
	}

	getValue() {
		return JSON.stringify(this.multiSelectValues);
	}

	processPriorValue(last: string) {
		this.multiSelectValues = JSON.parse(last);
		this.selected = this.multiSelectValues.split(' | ');
	}

	getSelect2GroupedList(): Select2OptionData[] {
		return this.options;
	}
	changed(data: { value: string[] }) {
		this.multiSelectValues = data.value.join(' | ');
	}
}
