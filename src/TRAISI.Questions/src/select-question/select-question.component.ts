import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
	OnOptionsLoaded,
	QuestionConfiguration,
	QuestionOption,
	SurveyResponder,
	SurveyViewer,
	TRAISI
} from 'traisi-question-sdk';
import { Select2OptionData } from 'ng2-select2';

declare var $: any;

@Component({
	selector: 'traisi-select-question',
	template: require('./select-question.component.html').toString(),
	styles: [require('./select-question.component.scss').toString()]
})
export class SelectQuestionComponent extends TRAISI.SurveyQuestion<TRAISI.ResponseTypes.List>
	implements OnInit, OnOptionsLoaded {
	readonly QUESTION_TYPE_NAME: string = 'Select Question';

	typeName: string;
	icon: string;

	options: QuestionOption[];

	optionData: Array<Select2OptionData>;



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
		this.options = [];
		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
		this.optionData = [];
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: QuestionConfiguration[]) {
		console.log(data);
	}

	ngOnInit() {}

	/**
	 *
	 * @param options
	 */
	onOptionsLoaded(options: QuestionOption[]): void {
		this.options = options;
		this.optionData = [];
		for (let option of options) {
			this.optionData.push({
				id: String(option.id),
				text: option.label
			});
		}
		this.cdr.detectChanges();
	}
}
