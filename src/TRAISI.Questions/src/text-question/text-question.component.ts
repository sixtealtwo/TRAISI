import { Component, OnInit, OnDestroy, Inject, EventEmitter, ViewChild } from '@angular/core';
import {
	OnVisibilityChanged,
	SurveyViewer,
	OnSurveyQuestionInit,
	QuestionConfiguration,
	QuestionResponseState,
	TRAISI
} from 'traisi-question-sdk';

@Component({
	selector: 'traisi-text-question',
	template: require('./text-question.component.html').toString(),
	styles: [require('./text-question.component.scss').toString()]
})
export class TextQuestionComponent extends TRAISI.SurveyQuestion<TRAISI.ResponseTypes.String>
	implements OnInit, OnVisibilityChanged, OnSurveyQuestionInit {
	typeName: string;
	icon: string;
	readonly QUESTION_TYPE_NAME: string = 'Text Question';

	public inputText: string;

	@ViewChild('textInput')
	textInput: HTMLInputElement;

	onQuestionShown(): void {
		console.log('shown');
	}

	onQuestionHidden(): void {
		console.log('hidde');
	}

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer) {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'text';
	}

	ngOnInit() {
		this.onQuestionShown();
	}

	/**
	 * This will write a new response o the server
	 *
	 * @memberof TextQuestionComponent
	 */
	handleComponentBlur(): void {
		let data: TRAISI.StringResponseData = {
			value: this.inputText + 'cat'
		};
		this.response.emit(data);
	}

	/**
	 *
	 * @param configuration
	 */
	onSurveyQuestionInit(configuration: QuestionConfiguration[]): void {}
}
