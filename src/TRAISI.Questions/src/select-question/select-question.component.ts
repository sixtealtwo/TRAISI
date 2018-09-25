import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
	OnOptionsLoaded,
	QuestionConfiguration,
	QuestionOption,
	SurveyResponder,
	SurveyViewer,
	TRAISI
} from 'traisi-question-sdk';

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

	selectOptions: QuestionOption[];

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

	ngOnInit() {}

	/**
	 * This is called as soon as any options are ready (even if later queried).
	 * @param options
	 */
	onOptionsLoaded(options: QuestionOption[]): void {
		this.selectOptions = options;


	}
}
