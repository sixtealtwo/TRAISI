import {
	Component,
	EventEmitter,
	Inject,
	OnInit,
	TemplateRef,
	ViewChildren,
	ElementRef,
	AfterContentInit,
	QueryList,
	AfterViewInit
} from '@angular/core';
import {
	SurveyQuestion,
	ResponseTypes,
	SurveyResponder,
	QuestionConfiguration,
	SurveyViewer,
	OnSurveyQuestionInit,
	OnVisibilityChanged,
	OnSaveResponseStatus,
	StringResponseData,
	OnOptionsLoaded,
	QuestionOption,
	ResponseData,
	ResponseValidationState,
	OptionSelectResponseData
} from 'traisi-question-sdk';

import templateString from './radio-question.component.html';
@Component({
	selector: 'traisi-radio-question',
	template: <string>templateString,
	styles: [require('./radio-question.component.scss').toString()]
})
export class RadioQuestionComponent extends SurveyQuestion<ResponseTypes.OptionSelect> implements OnInit, OnOptionsLoaded, AfterViewInit {
	public options: QuestionOption[];

	public selectedOption: any;

	public customResponseValue: string;

	public customResponseOptions: Set<string>;

	@ViewChildren('input', {})
	public inputElements: QueryList<ElementRef>;

	/**
	 *
	 * @param _surveyViewerService
	 * @param _surveyResponderService
	 */
	constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder
	) {
		super();
		this.options = [];
		this.customResponseOptions = new Set<string>();
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		this.configuration['allowCustomResponse'] = this.configuration['allowCustomResponse'] === 'true' ? true : false;
		this._surveyViewerService.options.subscribe((value: QuestionOption[]) => {});
		if (this.configuration['customResponseOptions'] !== undefined) {
			const options = this.configuration['customResponseOptions'].split(',');
			this.customResponseOptions = new Set(options);
			console.log(this.customResponseOptions);
		}
	}

	/**
	 * Determines whether saved response data on
	 */
	private onSavedResponseData: (response: ResponseData<ResponseTypes.OptionSelect>[] | 'none') => void = (
		response: ResponseData<ResponseTypes.OptionSelect>[] | 'none'
	) => {
		if (response !== 'none') {
			let optionResponse = <OptionSelectResponseData>response[0];

			this.selectedOption = optionResponse.code;
			if (this.customResponseOptions.has(optionResponse.code)) {
				this.customResponseValue = optionResponse.value;
			}
			this.validationState.emit(ResponseValidationState.VALID);
		}

		this.isLoaded.next(true);
	};

	/**
	 *
	 */
	public ngAfterViewInit(): void {
		this.savedResponse.subscribe(this.onSavedResponseData);
	}

	/**
	 * Determines whether model changed on
	 */
	public onModelChanged(option: OptionSelectResponseData): void {
		if (this.customResponseOptions.has(option.code)) {
			this.onCustomModelChanged();
		} else {
			option.value = option.code;
			this.response.emit([option]);
		}
	}

	/**
	 *
	 */
	public onCustomModelChanged(): void {
		let response = { code: this.selectedOption, value: this.customResponseValue };

		if (this.customResponseValue && this.customResponseValue.trim().length > 0) {
			this.response.emit([response]);
		} else {
			this.validationState.emit(ResponseValidationState.INVALID);
		}
	}

	/**
	 *
	 *
	 * @param {*} result
	 * @memberof TextQuestionComponent
	 */
	public onResponseSaved(result: any): void {
		this.validationState.emit(ResponseValidationState.VALID);
		this.autoAdvance.emit(500);
	}

	/**
	 *
	 * @param options
	 */
	public onOptionsLoaded(options: QuestionOption[]): void {
		this.options = options;
	}
}
