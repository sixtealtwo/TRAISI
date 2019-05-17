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

	@ViewChildren('input')
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
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		this._surveyViewerService.options.subscribe((value: QuestionOption[]) => {});
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
			this.validationState.emit(ResponseValidationState.VALID);
		}
	};

	public ngAfterViewInit(): void {
		this.savedResponse.subscribe(this.onSavedResponseData);
	}

	/**
	 * Determines whether model changed on
	 */
	public onModelChanged(option: QuestionOption): void {
		this.response.emit([option]);
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
