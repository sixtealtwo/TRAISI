import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
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
	ResponseValidationState,
	ResponseData,
	OptionSelectResponseData
} from 'traisi-question-sdk';

declare var $: any;

@Component({
	selector: 'traisi-select-question',
	template: require('./select-question.component.html').toString(),
	styles: [require('./select-question.component.scss').toString()],
	encapsulation: ViewEncapsulation.None
})
export class SelectQuestionComponent extends SurveyQuestion<ResponseTypes.OptionSelect>
	implements OnInit, OnOptionsLoaded, AfterViewInit {
	readonly QUESTION_TYPE_NAME: string = 'Select Question';

	typeName: string;
	icon: string;
	selectOptions: QuestionOption[];
	selectedOptionId: string;

	@ViewChild('select')
	selectElement: ElementRef;

	/**
	 *
	 * @param surveyViewerService
	 * @param surveyResponderService
	 * @param cdr
	 */
	constructor(
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private surveyResponderService: SurveyResponder,
		private cdr: ChangeDetectorRef
	) {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'select';
		this.selectOptions = [];
		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: QuestionConfiguration[]) {

	}

	public ngOnInit(): void {}

	public ngAfterViewInit(): void {
		this.savedResponse.subscribe(this.onSavedResponseData);
	}

		/**
	 * Determines whether saved response data on
	 */
	private onSavedResponseData: (response: ResponseData<ResponseTypes.OptionSelect>[] | 'none') => void = (
		response: ResponseData<ResponseTypes.OptionSelect>[] | 'none'
	) => {
		if (response !== 'none') {
			let optionResponse = <OptionSelectResponseData>response[0];

			this.selectedOptionId = optionResponse.code;

			this.validationState.emit(ResponseValidationState.VALID);
		}
	};


	/**
	 * This is called as soon as any options are ready (even if later queried).
	 * @param options
	 */
	public onOptionsLoaded(options: QuestionOption[]): void {
		this.selectOptions = options;

	}

	public onModelChanged(option: QuestionOption): void {
		if (option) {
			this.response.emit([option]);
		}
	}

	public onResponseSaved(result: any): void {
		this.validationState.emit(ResponseValidationState.VALID);
		//this.autoAdvance.emit(500);
	}


}

