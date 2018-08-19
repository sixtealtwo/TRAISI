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
	}

	getValue() {
		return JSON.stringify(this.multiSelectValues);
	}

	getSelect2GroupedList(): Select2OptionData[] {
		return this.options;
	}
	changed(data: { value: string[] }) {
		this.multiSelectValues = data.value.join(' | ');
	}
}
