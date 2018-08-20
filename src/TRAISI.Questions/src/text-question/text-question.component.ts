import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'traisi-text-question',
	template: <string>require('./text-question.component.html'),
	styles: [require('./text-question.component.scss').toString()]
})
export class TextQuestionComponent implements OnInit {

	readonly QUESTION_TYPE_NAME: string = 'Text Question';

	typeName: string;
	icon: string;
	constructor() {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'text';
		console.log("loaded");
	
	}

	ngOnInit() {
		console.log("init");
	}

}
