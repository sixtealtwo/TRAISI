import { Component, OnInit } from '@angular/core';
import { QuestionConfigurationDefinition } from '../../../models/question-configuration-definition.model';

@Component({
	selector: 'app-textbox',
	templateUrl: './textbox.component.html',
	styleUrls: ['./textbox.component.scss']
})
export class TextboxComponent implements OnInit {

	public id;
	public questionConfiguration: QuestionConfigurationDefinition;
	public textValue: string;

	constructor() {}

	ngOnInit() {
		this.setDefaultValue();
	}

	setDefaultValue() {
		this.textValue = this.questionConfiguration.defaultValue;
	}

	getValue(){
		return JSON.stringify({text: this.textValue});
	}

}
