import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { OnVisibilityChanged, SurveyViewer } from 'traisi-question-sdk';

@Component({
	selector: 'traisi-text-question',
	template: require('./text-question.component.html').toString(),
	styles: [require('./text-question.component.scss').toString()]
})
export class TextQuestionComponent implements OnInit, OnVisibilityChanged {
	questionShown(): void {
		throw new Error('Method not implemented.');
	}

	questionHidden(): void {
		throw new Error('Method not implemented.');
	}
	readonly QUESTION_TYPE_NAME: string = 'Text Question';

	typeName: string;
	icon: string;
	constructor(@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer) {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'text';
	}

	ngOnInit() {}
}
