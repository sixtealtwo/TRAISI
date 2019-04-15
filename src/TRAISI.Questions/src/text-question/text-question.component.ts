import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import {
	OnSaveResponseStatus,
	OnVisibilityChanged,
	ResponseData,
	ResponseTypes,
	ResponseValidationState,
	StringResponseData,
	SurveyQuestion,
	SurveyViewer
} from 'traisi-question-sdk';
import { TextQuestionConfiguration } from './text-question.configuration';

@Component({
	selector: 'traisi-text-question',
	template: require('./text-question.component.html'),
	styles: [require('./text-question.component.scss')]
})
export class TextQuestionComponent extends SurveyQuestion<ResponseTypes.String>
	implements OnInit, OnVisibilityChanged, OnSaveResponseStatus {
	public textInput: string;

	public isLoaded: boolean;

	@ViewChild('inputElement')
	private textInputElement: HTMLInputElement;

	@ViewChild('f')
	public inputForm: NgForm;

	public configuration: TextQuestionConfiguration;

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer) {
		super();

		this.textInput = undefined;
		this.isLoaded = false;
	}

	public ngOnInit(): void {
		this.onQuestionShown();

		this.configuration.maxLength = parseInt('' + this.configuration.maxLength, 10);
		this.configuration.multiline = '' + this.configuration.multiline === 'false' ? false : true;

		this.savedResponse.subscribe(this.onSavedResponseData);
	}

	public onQuestionShown(): void {}

	public onQuestionHidden(): void {}

	/**
	 * Determines whether saved response data on
	 */
	private onSavedResponseData: (response: ResponseData<ResponseTypes.String>[] | 'none') => void = (
		response: ResponseData<ResponseTypes.String>[] | 'none'
	) => {
		if (response !== 'none') {
			let stringResponse = <StringResponseData>response[0];
			this.textInput = stringResponse.value;
			if (this.isInputValid(this.textInput)) {
				this.validationState.emit(ResponseValidationState.VALID);
			}
		}

		this.inputForm.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
			if (this.textInput === undefined) {
				return;
			}
			if (!this.isInputValid(value.textInput)) {
				this.validationState.emit(ResponseValidationState.INVALID);
			} else {
				let data: StringResponseData = {
					value: this.textInput
				};

				this.response.emit(data);
			}
		});
		this.isLoaded = true;
	};

	/**
	 *
	 * @param textInput
	 */
	private isInputValid(textInput: string): boolean {
		return textInput !== null || (textInput.trim().length > 0 && textInput.trim().length <= this.configuration.maxLength);
	}

	/**
	 *
	 *
	 * @param {*} result
	 * @memberof TextQuestionComponent
	 */
	public onResponseSaved(result: any): void {
		this.validationState.emit(ResponseValidationState.VALID);
	}

	/**
	 * Traisis on loaded
	 */
	public traisiOnLoaded(): void {}
}
