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

	public min: number = 0;
	public max: number = 100;
	public autoCorrect: boolean = true;
	public numericValue: number;

	constructor() {}

	ngOnInit() {
	}

	getValue(){
		return JSON.stringify({value: this.numericValue});
	}
}

