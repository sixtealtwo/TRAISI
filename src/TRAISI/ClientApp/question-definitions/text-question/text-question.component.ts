import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'traisi-text-question',
	templateUrl: './text-question.component.html',
	styleUrls: ['./text-question.component.scss']
})
export class TextQuestionComponent implements OnInit, SurveyQuestion {

	readonly QUESTION_TYPE_NAME: string = 'Text Question';

	typeName: string;
	icon: string;
	constructor() {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'text';
	}

	ngOnInit() {

	}

}
