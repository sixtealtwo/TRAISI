import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { SharedDataService } from '../../../services/shared-data.service';
import { QuestionConfigurationDefinition } from '../../../models/question-configuration-definition.model';

interface Item {
	label: string;
	status: boolean;
}

@Component({
	selector: 'app-checkbox',
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

	public id: number;
	public questionConfiguration: QuestionConfigurationDefinition;

	public options: Array<Item> = [];

	constructor() {}

	ngOnInit() {
		let optionData = JSON.parse(this.questionConfiguration.resourceData);
		optionData.options.forEach((element) => {
			this.options.push({ label: element, status: false});
		});
	}

	onChange(event, option) {
		option.status = !option.status;
	}

	getValue() {
		let data = [];
		this.options.forEach(option => {
			if (option.status) {
				data.push({ label: option.label });
			}
		});
		return JSON.stringify(data);
	}
}
