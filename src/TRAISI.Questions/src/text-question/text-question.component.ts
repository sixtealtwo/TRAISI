import { Component, OnInit, OnDestroy, Inject, EventEmitter, ViewChild } from '@angular/core';

import {
	OnVisibilityChanged,
	SurveyViewer,
	OnSurveyQuestionInit,
	QuestionConfiguration,
	QuestionResponseState,
	TRAISI
} from 'traisi-question-sdk';
import { OnSaveResponseStatus } from 'traisi-sdk/survey_lifecycle_hooks';

@Component({
	selector: 'traisi-text-question',
	template: require('./text-question.component.html').toString(),
	styles: [require('./text-question.component.scss').toString()]
})
export class TextQuestionComponent extends TRAISI.SurveyQuestion<TRAISI.ResponseTypes.String>
	implements OnInit, OnVisibilityChanged, OnSurveyQuestionInit, OnSaveResponseStatus {
	typeName: string;
	icon: string;
	readonly QUESTION_TYPE_NAME: string = 'Text Question';

	public textInput: string;



	@ViewChild('inputElement')
	private textInputElement: HTMLInputElement;

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
		this.textInput = '';
	}

	ngOnInit() {
		this.onQuestionShown();

		console.log(this.configuration);
	}

	/**
	 * This will write a new response o the server
	 *
	 * @memberof TextQuestionComponent
	 */
	handleComponentBlur(): void {
		let data: TRAISI.StringResponseData = {
			value: this.textInput
		};
		this.response.emit(data);
	}

	/**
	 *
	 * @param configuration
	 */
	onSurveyQuestionInit(configuration: QuestionConfiguration[]): void {}

	/**
	 *
	 *
	 * @param {*} result
	 * @memberof TextQuestionComponent
	 */
	onResponseSaved(result: any): void {
		console.log('result from text question: ' + result);
	}
}
