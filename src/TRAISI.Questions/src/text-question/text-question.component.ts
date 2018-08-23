import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { OnVisibilityChanged, ISurveyViewerService } from 'traisi-question-sdk';

@Component({
	selector: 'traisi-text-question',
	template: require('./text-question.component.html').toString(),
	styles: [require('./text-question.component.scss').toString()]
})
export class TextQuestionComponent implements OnInit, OnVisibilityChanged {
	readonly QUESTION_TYPE_NAME: string = 'Text Question';

	typeName: string;
	icon: string;
	constructor(@Inject('ISurveyViewerService') private surveyViewerService: ISurveyViewerService) {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'text';
	}

	ngOnInit() {}
}
