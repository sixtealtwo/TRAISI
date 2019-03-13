import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs';
import {
	OnOptionsLoaded,
	OnSaveResponseStatus,
	OnVisibilityChanged,
	QuestionOption,
	ResponseTypes,
	SurveyQuestion,
	SurveyViewer,
	SurveyResponder
} from 'traisi-question-sdk';
import { StatedPreferenceConfig } from '../stated-preference-config.model';
import { FormArrayName, NgForm } from '@angular/forms';
import * as dot from 'dot';
/**
 * Base question component definition for the question type "Stated Preference"
 *
 * @export
 * @class StatedPreferenceQuestionComponent
 * @extends {SurveyQuestion<ResponseTypes.String>}
 * @implements {OnInit}
 * @implements {OnVisibilityChanged}
 * @implements {OnSaveResponseStatus}
 */
@Component({
	selector: 'traisi-stated-preference-question',
	template: require('./stated-preference-question.component.html'),
	styles: [require('./stated-preference-question.component.scss')]
})
export class StatedPreferenceQuestionComponent extends SurveyQuestion<ResponseTypes.OptionSelect[]>
	implements OnInit, OnVisibilityChanged, OnSaveResponseStatus, AfterViewInit {
	public options: QuestionOption[];
	public model: ReplaySubject<StatedPreferenceConfig>;
	public hasError: boolean = false;
	public displayModel: ReplaySubject<Array<any>>;
	public displayModelColumns: ReplaySubject<Array<string>>;
	public inputModel: { value?: string };

	@ViewChild('spForm')
	public spForm: NgForm;

	/**
	 *
	 * @param _surveyViewerService
	 * @param _responderService
	 */
	constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private _responderService: SurveyResponder
	) {
		super();
		this.model = new ReplaySubject<StatedPreferenceConfig>(1);
		this.displayModel = new ReplaySubject<Array<any>>(1);
		this.displayModelColumns = new ReplaySubject<Array<string>>(1);
		this.inputModel = {};

	}

	public onQuestionShown(): void {}
	public onQuestionHidden(): void {}
	public onResponseSaved(result: any): void {}

	/**
	 * @private
	 * @param {QuestionOption} value
	 * @memberof StatedPreferenceQuestionComponent
	 */
	private parseSpModel(value: any): void {
		try {
			let spModel = JSON.parse(value.label);
			this.model.next(spModel);
			this.displayModel.next(this.transformToDisplayableData(spModel));
		} catch (exception) {
			console.error(exception);
			this.hasError = true;
		}
	}


	/**
	 * Tells the responder service to load / cache all respones for this respondent.
	 * @private
	 * @memberof StatedPreferenceQuestionComponent
	 */
	private prepareResponses() {
		this._responderService.preparePreviousSurveyResponses(this.respondent);
	}

	/**
	 * @memberof StatedPreferenceQuestionComponent
	 */
	public ngOnInit(): void {
		this.questionOptions.subscribe(options => {
			if (options.length > 0) {
				this.parseSpModel(options[0]);
			}
		});
	}

	/**
	 * Converts the SP question configuration into a displayable array consumable
	 * by the cdk-table component. This involves flattening the information into
	 * a rectangular array representing row/column cell data.
	 * @private
	 * @param {StatedPreferenceConfig} config
	 * @returns {Array<any>}
	 * @memberof StatedPreferenceQuestionComponent
	 */
	private transformToDisplayableData(config: StatedPreferenceConfig): Array<any> {
		let columnArray = [];
		let spDataArray: Array<any> = [];
		columnArray.push('row');
		columnArray = columnArray.concat(config.headers);
		for (let r = 0; r < config.rowHeaders.length; r++) {
			let spDataRow: {} = {};
			spDataRow[0] = config.rowHeaders[r];
			for (let c = 1; c < config.choices.length + 1; c++) {
				spDataRow[c] = dot.template(config.choices[c - 1].items[r].label)();
			}
			spDataArray.push(spDataRow);
		}

		this.displayModelColumns.next(columnArray);
		console.log(columnArray);
		return spDataArray;
	}

	/**
	 * @param {*} $event
	 * @param {*} col
	 * @memberof StatedPreferenceQuestionComponent
	 */
	public selectChoice($event, col, index): void {
		this.inputModel.value = col;
	}


	/**
	 * @memberof StatedPreferenceQuestionComponent
	 */
	public ngAfterViewInit(): void {}
}
