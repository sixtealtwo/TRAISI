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

	onQuestionShown(): void {}

	onQuestionHidden(): void {}

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

	public ngOnInit(): void {
		this.onQuestionShown();

		this.savedResponse.subscribe(this.onSavedResponseData);
	}

	/**
	 * Determines whether saved response data on
	 */
	private onSavedResponseData: (response: ResponseData<ResponseTypes.String>[] | 'none') => void = (
		response: ResponseData<ResponseTypes.String>[] | 'none'
	) => {
		if (response !== 'none') {
			let stringResponse = <StringResponseData>response[0];
			this.textInput = stringResponse.value;
			this.validationState.emit(ResponseValidationState.VALID);
		}
	};
	/**
	 * This will write a new response o the server
	 *
	 * @memberof TextQuestionComponent
	 */
	public handleComponentBlur(): void {
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
	public onSurveyQuestionInit(configuration: QuestionConfiguration[]): void {}

	/**
	 *
	 *
	 * @param {*} result
	 * @memberof TextQuestionComponent
	 */
	public onResponseSaved(result: any): void {
		console.log('result from text question: ' + result);
	}

	/**
	 * Traisis on loaded
	 */
	public traisiOnLoaded(): void {
		console.log('traisi on loaded called');
		this.isLoaded = true;
	}
}
