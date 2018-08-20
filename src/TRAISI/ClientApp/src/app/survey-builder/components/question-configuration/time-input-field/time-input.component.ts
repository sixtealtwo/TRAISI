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
	public timePickerValue: string = '8:00';

	constructor() {}

	ngOnInit() {
		this.setDefaultValue();
	}

	setDefaultValue() {
		this.timePickerValue = this.questionConfiguration.defaultValue;
	}

	getValue(){
		return JSON.stringify({date: this.timePickerValue});
	}

}
