import { Component, OnInit } from '@angular/core';
import { QuestionConfigurationDefinition } from '../../../models/question-configuration-definition.model';

@Component({
	selector: 'app-switch',
	templateUrl: './switch.component.html',
	styleUrls: ['./switch.component.scss']
})

export class SwitchComponent implements OnInit {

	public id: number;
	public questionConfiguration: QuestionConfigurationDefinition;

	public switchValue = false;

	constructor() {}

	ngOnInit() {
		this.setDefaultValue();
	}

	setDefaultValue() {
		this.switchValue = this.questionConfiguration.defaultValue === 'true';
	}

	getValue(){
		return JSON.stringify({status: this.switchValue});
	}
}
