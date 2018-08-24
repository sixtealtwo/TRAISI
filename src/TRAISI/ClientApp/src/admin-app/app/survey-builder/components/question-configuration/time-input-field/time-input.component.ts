import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { QuestionConfigurationDefinition } from '../../../models/question-configuration-definition.model';
import { AmazingTimePickerService } from 'amazing-time-picker';

@Component({
	selector: 'app-time-input',
	templateUrl: './time-input.component.html',
	styleUrls: ['./time-input.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TimeInputComponent implements OnInit {
	public id: number;
	public questionConfiguration: QuestionConfigurationDefinition;
	public timePickerValue: string;

	constructor() {}

	ngOnInit() {
		if (this.timePickerValue === undefined) {
			this.setDefaultValue();
		}
	}

	setDefaultValue() {
		this.timePickerValue = this.questionConfiguration.defaultValue;
	}

	getValue(){
		return JSON.stringify(this.timePickerValue);
	}

	processPriorValue(last: string) {
		this.timePickerValue = JSON.parse(last);
	}

}
