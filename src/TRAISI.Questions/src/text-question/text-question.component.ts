import { Component, OnInit, OnDestroy, Inject, EventEmitter, ViewChild } from '@angular/core';

import {
	SurveyQuestion,
	ResponseTypes,
	SurveyResponder,
	QuestionConfiguration,
	SurveyViewer,
	OnSurveyQuestionInit,
	OnVisibilityChanged,
	OnSaveResponseStatus,
	OnOptionsLoaded,
	QuestionOption,
	ResponseData,
	StringResponseData,
	ResponseValidationState
} from 'traisi-question-sdk';

@Component({
	selector: 'traisi-text-question',
	template: require('./text-question.component.html').toString(),
	styles: [require('./text-question.component.scss').toString()]
})
export class TextQuestionComponent extends SurveyQuestion<ResponseTypes.String>
	implements OnInit, OnVisibilityChanged, OnSurveyQuestionInit, OnSaveResponseStatus {
	typeName: string;
	icon: string;
	readonly QUESTION_TYPE_NAME: string = 'Text Question';

	public textInput: string;

	public isLoaded: boolean;

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
		this.isLoaded = false;
	}

	ngOnInit() {
		this.onQuestionShown();

		this.savedResponse.subscribe(this.onSavedResponseData);
	}

	private onSavedResponseData: (response: ResponseData<ResponseTypes.String> | 'none') => void = (
		response: ResponseData<ResponseTypes.String> | 'none'
	) => {
		if (response !== 'none') {
			let stringResponse = <StringResponseData>response;
			this.textInput = stringResponse.value;
		}
	}
	/**
	 * This will write a new response o the server
	 *
	 * @memberof TextQuestionComponent
	 */
	handleComponentBlur(): void {
		let data: StringResponseData = {
			value: this.textInput
		};
		this.response.emit(data);
		this.validationState.emit(ResponseValidationState.VALID);
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

	traisiOnLoaded()
	{
		console.log('traisi on loaded called');
		this.isLoaded = true;
	}
}
