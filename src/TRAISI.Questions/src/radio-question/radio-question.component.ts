import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'traisi-radio-question',
	template: require('./radio-question.component.html').toString()
})
export class RadioQuestionComponent implements OnInit {

	readonly QUESTION_TYPE_NAME: string = 'Radio Question';

	typeName: string;
	icon: string;
	constructor() {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'radio';
		console.log("loaded");
	
	}

	ngOnInit() {
		console.log("init");
	}

}
