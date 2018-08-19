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

	public multiSelectlistItems: Array<string> = [
	];

	data: Select2OptionData[] = [];

	select2Options: any = {
		theme: 'bootstrap'
	};
	public multiSelectValue = [];

	constructor() {}

	ngOnInit() {

	}

	getValue(){
		return JSON.stringify(this.multiSelectValue);
	}

	getSelect2GroupedList(): Select2OptionData[] {
		return this.data;
	}
}
