import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'traisi-text-question',
	template: require('./text-question.component.html') as string,
	styles: [require('./text-question.component.scss') as string]
})
export class TextQuestionComponent implements OnInit {

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
