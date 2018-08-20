import { Component, OnInit } from '@angular/core';
import { QuestionConfigurationDefinition } from '../../../models/question-configuration-definition.model';

@Component({
	selector: 'app-numeric-textbox',
	templateUrl: './numeric-textbox.component.html',
	styleUrls: ['./numeric-textbox.component.scss']
})
export class NumericTextboxComponent implements OnInit {
	public id: number;
	public questionConfiguration: QuestionConfigurationDefinition;

	public numericValue: number;

	constructor() {}

	ngOnInit() {
		this.setDefaultValue();
	}

	setDefaultValue() {
		this.numericValue = +this.questionConfiguration.defaultValue;
	}

	getValue(){
		return JSON.stringify({value: this.numericValue});
	}
}

