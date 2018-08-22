import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'traisi-heading-question',
	template: <string>require('./heading-question.component.html'),
	styles: [require('./heading-question.component.scss').toString()]
})
export class HeadingQuestionComponent implements OnInit {

	readonly QUESTION_TYPE_NAME: string = 'Heading';

	typeName: string;
	icon: string;
	constructor() {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'heading';
		console.log("loaded");
	
	}

	ngOnInit() {
		console.log("init");
	}

}
